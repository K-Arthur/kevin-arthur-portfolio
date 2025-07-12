import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';

const execAsync = promisify(exec);

// Verify Cloudinary webhook signature
function verifyCloudinarySignature(body, signature, timestamp) {
  const webhookSecret = process.env.CLOUDINARY_WEBHOOK_SECRET;
  if (!webhookSecret) return true; // Skip verification if no secret set
  
  const expectedSignature = crypto
    .createHmac('sha1', webhookSecret)
    .update(body + timestamp)
    .digest('hex');
    
  return signature === expectedSignature;
}

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-cld-signature');
    const timestamp = request.headers.get('x-cld-timestamp');
    
    // Verify webhook signature (optional but recommended)
    if (!verifyCloudinarySignature(body, signature, timestamp)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const payload = JSON.parse(body);
    console.log('Cloudinary webhook received:', payload.notification_type);
    
    // Check if this is a relevant change (upload, delete, etc.)
    const relevantEvents = ['upload', 'delete', 'update', 'rename'];
    if (!relevantEvents.includes(payload.notification_type)) {
      return NextResponse.json({ message: 'Event ignored' });
    }
    
    // Check if the change is in our project folders
    const resourcePath = payload.public_id || '';
    const baseFolder = process.env.CLOUDINARY_BASE_FOLDER || '';
    
    if (baseFolder && !resourcePath.startsWith(baseFolder)) {
      return NextResponse.json({ message: 'Change outside project folders, ignored' });
    }
    
    console.log('Triggering media metadata regeneration due to Cloudinary change...');
    
    // Regenerate metadata asynchronously to avoid timeout
    execAsync('node scripts/generate-media-metadata.js', {
      cwd: process.cwd(),
      env: process.env
    }).then(() => {
      console.log('Media metadata regenerated successfully');
      // Revalidate pages
      revalidatePath('/work');
      revalidatePath('/work/[slug]', 'page');
    }).catch(error => {
      console.error('Error regenerating metadata:', error);
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received, regeneration triggered',
      event: payload.notification_type 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error.message 
    }, { status: 500 });
  }
} 