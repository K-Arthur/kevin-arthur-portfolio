export async function generateStaticParams() { return []; }
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request) {
  try {
    // Check for authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVALIDATE_TOKEN;

    if (!expectedToken) {
      console.error('REVALIDATE_TOKEN environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting media metadata regeneration...');
    
    // Run the metadata generation script
    const { stdout, stderr } = await execAsync('node scripts/generate-media-metadata.js', {
      cwd: process.cwd(),
      env: process.env
    });
    
    if (stderr) {
      console.error('Script stderr:', stderr);
    }
    
    console.log('Script stdout:', stdout);
    
    // Revalidate the work pages - both the main gallery and individual project pages
    revalidatePath('/work');
    revalidatePath('/work/[slug]', 'page');
    console.log('Pages revalidated: /work and /work/[slug]');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Media metadata regenerated successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error regenerating media metadata:', error);
    return NextResponse.json({ 
      error: 'Failed to regenerate media metadata',
      details: error.message 
    }, { status: 500 });
  }
} 
export async function GET() {
  return new Response(JSON.stringify({ message: 'Static' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
