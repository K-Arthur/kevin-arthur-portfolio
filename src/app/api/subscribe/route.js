import { NextResponse } from 'next/server';

/**
 * POST /api/subscribe
 * Handles email subscription for lead magnets
 * 
 * Integrates with email service (ConvertKit/Mailchimp)
 * Currently set up for ConvertKit - update credentials in .env
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, resource } = body;

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

    // Mailchimp Integration (alternative)
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER; // e.g., 'us19'

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

    // Fallback: Log subscription for manual handling
    // In production, you should always have an email service configured
    console.log('📧 New subscription (no email service configured):', {
      name,
      email,
      resource,
      timestamp: new Date().toISOString(),
    });

    // Store in a simple JSON file or database in production
    // For now, just return success to not block the UX
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
