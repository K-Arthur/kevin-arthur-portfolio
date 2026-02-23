export async function generateStaticParams() { return []; }
import { NextResponse } from 'next/server';
import { consumeVerificationToken } from '@/lib/verification-store';



/**
 * GET /api/verify-email?token=xxx
 * Verifies email address and returns verification status
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const verificationData = consumeVerificationToken(token);

    if (!verificationData) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Add user to email list (ConvertKit/Mailchimp)
    const { email, name, resource } = verificationData;

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
        // Continue anyway - user is verified
      }
    }

    // Mailchimp Integration (alternative)
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER;

    if (MAILCHIMP_API_KEY && MAILCHIMP_AUDIENCE_ID && MAILCHIMP_SERVER && !CONVERTKIT_API_KEY) {
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
        if (errorData.title !== 'Member Exists') {
          console.error('Mailchimp error:', errorData);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully!',
      email,
      resource,
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
