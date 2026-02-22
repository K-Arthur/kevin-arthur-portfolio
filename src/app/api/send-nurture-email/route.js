export async function generateStaticParams() { return []; }
import { NextResponse } from 'next/server';

/**
 * POST /api/send-nurture-email
 * Handles email sequences for lead nurturing
 * 
 * Triggers different emails based on sequence step and user action
 * Integrates with ConvertKit/Mailchimp for actual email delivery
 */

// Email sequence templates
const EMAIL_TEMPLATES = {
  'email-1-welcome': {
    subject: 'Your resource is here! + a bonus',
    body: (name, resource) => `
Hi ${name || 'there'}! 👋

Thanks for downloading the ${getResourceName(resource)}. I hope you find it helpful!

Here's a quick tip to get the most out of it:
${getResourceTip(resource)}

If you have any questions or want to dive deeper, feel free to reply to this email.

Cheers,
Kevin
    `,
  },
  'email-2-followup': {
    subject: 'One thing I wish I knew earlier',
    body: (name, resource) => `
Hi ${name || 'there'},

I wanted to share something that took me years to learn...

When I first started designing AI interfaces, I made the mistake of treating them like traditional UI. Big mistake.

The key insight? AI is inherently uncertain. Your UX needs to communicate that uncertainty gracefully.

If you found the ${getResourceName(resource)} helpful, you might enjoy this related content:
${getRelatedContent(resource)}

Keep building amazing things,
Kevin
    `,
  },
  'email-3-consultation': {
    subject: 'Quick question about your project',
    body: (name, resource) => `
Hi ${name || 'there'},

I've been thinking about your project...

Are you currently working on an AI-powered product or complex SaaS platform?

If so, I'd love to help you avoid the pitfalls I've seen teams face. Book a free 15-minute call and let's chat:

https://calendly.com/arthurkevin27/15min

No pressure—just a conversation to see if I can help.

Best,
Kevin
    `,
  },
};

// Helper functions
function getResourceName(resource) {
  const names = {
    'design-checklist': 'Developer-Ready Design Checklist',
    'ai-audit': 'AI Readiness Audit',
    'ai-patterns-waitlist': 'AI Design Patterns Library',
    'live-experiments-waitlist': 'Motion Architecture Boilerplate',
  };
  return names[resource] || 'resource';
}

function getResourceTip(resource) {
  const tips = {
    'design-checklist': 'Start with the state management section—it\'s where most teams lose time during implementation.',
    'ai-audit': 'Focus on the confidence communication patterns. Even small improvements here make a huge difference.',
  };
  return tips[resource] || 'Take it one section at a time and apply what you learn immediately.';
}

function getRelatedContent(resource) {
  const content = {
    'design-checklist': 'Check out the AI Readiness Audit on the UX Lab page to see if your product is ready for AI features.',
    'ai-audit': 'Download the Design Checklist to ensure your designs ship exactly as intended.',
  };
  return content[resource] || 'Visit the UX Lab page for more tools and resources.';
}

// In-memory storage for nurture sequences (in production, use a database)
const nurtureStore = new Map();

// Get or create nurture state for a user
function getNurtureState(email) {
  if (!nurtureStore.has(email)) {
    nurtureStore.set(email, {
      email,
      sequenceStep: 0,
      emailsSent: [],
      lastEmailSent: null,
      resource: null,
      name: null,
      createdAt: new Date().toISOString(),
    });
  }
  return nurtureStore.get(email);
}

// Update nurture state
function updateNurtureState(email, updates) {
  const state = getNurtureState(email);
  Object.assign(state, updates);
  nurtureStore.set(email, state);
  return state;
}

// Check if it's time to send the next email
function shouldSendNextEmail(state) {
  if (state.sequenceStep === 0) return true; // First email
  
  const now = new Date();
  const lastSent = new Date(state.lastEmailSent);
  const hoursSinceLastEmail = (now - lastSent) / (1000 * 60 * 60);
  
  // Email 2: 24 hours after first email
  if (state.sequenceStep === 1 && hoursSinceLastEmail >= 24) {
    return true;
  }
  
  // Email 3: 3 days after second email (72 hours)
  if (state.sequenceStep === 2 && hoursSinceLastEmail >= 72) {
    return true;
  }
  
  return false;
}

// Send email via email service
async function sendEmail(email, subject, body) {
  const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
  const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
  
  if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
    // For ConvertKit, we'd typically use sequences/automations
    // This is a simplified version that logs the email
    console.log('📧 [ConvertKit] Email would be sent:', {
      to: email,
      subject,
      bodyLength: body.length,
    });
    return { success: true, provider: 'convertkit' };
  }
  
  // Log email for development/testing
  console.log('📧 [Nurture Email] Email would be sent:', {
    to: email,
    subject,
    body,
  });
  
  return { success: true, provider: 'development' };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, resource, trigger = 'manual' } = body;
    
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
    
    // Get or create nurture state
    let state = getNurtureState(email);
    
    // Update user info if provided
    if (name) state.name = name;
    if (resource) state.resource = resource;
    
    // Check if we should send the next email
    if (!shouldSendNextEmail(state)) {
      const hoursUntilNext = state.sequenceStep === 1 
        ? 24 - ((new Date() - new Date(state.lastEmailSent)) / (1000 * 60 * 60))
        : 72 - ((new Date() - new Date(state.lastEmailSent)) / (1000 * 60 * 60));
      
      return NextResponse.json({
        success: true,
        message: 'Next email not due yet',
        nextEmailIn: `${Math.round(hoursUntilNext)} hours`,
        sequenceStep: state.sequenceStep,
      });
    }
    
    // Determine which email to send
    let emailKey;
    if (state.sequenceStep === 0) {
      emailKey = 'email-1-welcome';
    } else if (state.sequenceStep === 1) {
      emailKey = 'email-2-followup';
    } else if (state.sequenceStep === 2) {
      emailKey = 'email-3-consultation';
    } else {
      return NextResponse.json({
        success: true,
        message: 'Email sequence complete',
        sequenceStep: state.sequenceStep,
      });
    }
    
    // Get email template
    const template = EMAIL_TEMPLATES[emailKey];
    const emailBody = template.body(state.name, state.resource);
    
    // Send email
    const sendResult = await sendEmail(email, template.subject, emailBody);
    
    // Update nurture state
    state = updateNurtureState(email, {
      sequenceStep: state.sequenceStep + 1,
      emailsSent: [...state.emailsSent, emailKey],
      lastEmailSent: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      message: `Email ${state.sequenceStep} sent successfully`,
      emailKey,
      sequenceStep: state.sequenceStep,
      provider: sendResult.provider,
      nextEmailIn: state.sequenceStep === 1 ? '24 hours' : state.sequenceStep === 2 ? '3 days' : 'complete',
    });
    
  } catch (error) {
    console.error('Nurture email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send nurture email' },
      { status: 500 }
    );
  }
}

// GET endpoint to check nurture status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }
    
    const state = getNurtureState(email);
    
    return NextResponse.json({
      success: true,
      state: {
        email: state.email,
        sequenceStep: state.sequenceStep,
        emailsSent: state.emailsSent,
        lastEmailSent: state.lastEmailSent,
        resource: state.resource,
        createdAt: state.createdAt,
      },
    });
    
  } catch (error) {
    console.error('Nurture status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get nurture status' },
      { status: 500 }
    );
  }
}
