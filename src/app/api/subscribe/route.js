export async function generateStaticParams() { return []; }
import { NextResponse } from 'next/server';
import { storeVerificationToken } from '@/lib/verification-store';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { randomBytes } from 'crypto';

/**
 * POST /api/subscribe
 * Handles email subscription for lead magnets with double opt-in
 *
 * Integrates with email service (ConvertKit/Mailchimp)
 * Currently set up for ConvertKit - update credentials in .env
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, resource, skipVerification = false, website: honeypot } = body;

    // Honeypot: bots often fill hidden fields. If filled, return success but do not subscribe.
    if (honeypot && String(honeypot).trim() !== '') {
      return NextResponse.json({ success: true, honeypotReject: true });
    }

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
              request.headers.get('x-real-ip') || 
              'unknown';
    const rateLimitResult = checkRateLimit(ip, 'subscribe');
    
    if (!rateLimitResult.allowed) {
      const headers = getRateLimitHeaders(rateLimitResult);
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429, headers }
      );
    }

    // Double opt-in flow (unless skipVerification is true)
    if (!skipVerification) {
      // Generate verification token
      const token = randomBytes(32).toString('hex');

      // Store verification token
      storeVerificationToken(email, token);

      // Update stored data with name and resource
      const verificationStore = await import('@/lib/verification-store');
      const data = verificationStore.getVerificationData(token);
      if (data) {
        data.name = name;
        data.resource = resource;
      }

      // Generate verification URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
      const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`;

      // In production, send verification email via email service
      // For now, we'll return the verification URL for testing
      console.log('📧 Verification email would be sent to:', email);
      console.log('📧 Verification URL:', verificationUrl);

      return NextResponse.json({
        success: true,
        message: 'Please check your email to verify your subscription.',
        requiresVerification: true,
        verificationUrl, // Only for development/testing
      }, { headers: getRateLimitHeaders(rateLimitResult) });
    }

    // Skip verification flow (for testing or if double opt-in is disabled)
    // Determine tags based on resource
    const tags = [];
    if (resource === 'design-checklist') {
      tags.push('design-checklist-download');
    } else if (resource === 'ai-audit') {
      tags.push('ai-audit-complete');
    }

    // ConvertKit Integration
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

    if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
      const convertKitResponse = await fetch(
        `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: CONVERTKIT_API_KEY,
            email,
            first_name: name || '',
            tags,
            fields: {
              lead_magnet: resource,
              signup_date: new Date().toISOString(),
            },
          }),
        }
      );

      if (!convertKitResponse.ok) {
        const errorData = await convertKitResponse.json();
        console.error('ConvertKit error:', errorData);
        throw new Error('Failed to subscribe to email list');
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed!',
        provider: 'convertkit',
      });
    }

    // Trigger nurture email sequence
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-nurture-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          resource,
          trigger: 'subscription',
        }),
      });
    } catch (nurtureError) {
      console.error('Failed to trigger nurture sequence:', nurtureError);
      // Don't fail the subscription if nurture fails
    }

    // Mailchimp Integration (alternative)
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER;

    if (MAILCHIMP_API_KEY && MAILCHIMP_AUDIENCE_ID && MAILCHIMP_SERVER) {
      const mailchimpResponse = await fetch(
        `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            merge_fields: {
              FNAME: name || '',
              RESOURCE: resource,
            },
            tags: tags,
          }),
        }
      );

      if (!mailchimpResponse.ok) {
        const errorData = await mailchimpResponse.json();
        // Handle already subscribed case
        if (errorData.title === 'Member Exists') {
          return NextResponse.json({
            success: true,
            message: 'You\'re already subscribed! Check your inbox.',
            provider: 'mailchimp',
          });
        }
        console.error('Mailchimp error:', errorData);
        throw new Error('Failed to subscribe to email list');
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed!',
        provider: 'mailchimp',
      });
    }

    // Trigger nurture email sequence
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-nurture-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          resource,
          trigger: 'subscription',
        }),
      });
    } catch (nurtureError) {
      console.error('Failed to trigger nurture sequence:', nurtureError);
      // Don't fail the subscription if nurture fails
    }

    // Fallback: Log subscription for manual handling
    console.log('📧 New subscription (no email service configured):', {
      name,
      email,
      resource,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Thanks for signing up! Check your inbox soon.',
      provider: 'fallback',
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: 'Static' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
