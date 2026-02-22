export async function generateStaticParams() { return []; }
import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

// Analytics file path
const ANALYTICS_FILE_PATH = join(process.cwd(), 'data', 'analytics.json');

// Helper function to track PDF download
async function trackPDFDownload(type) {
  try {
    let analytics = {};
    try {
      const data = await readFile(ANALYTICS_FILE_PATH, 'utf-8');
      analytics = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
      analytics = {
        pdfDownloads: { total: 0, byType: {} },
        timestamps: { firstEvent: null, lastEvent: null },
      };
    }

    // Update PDF downloads
    if (!analytics.pdfDownloads) {
      analytics.pdfDownloads = { total: 0, byType: {} };
    }
    analytics.pdfDownloads.total += 1;

    if (!analytics.pdfDownloads.byType[type]) {
      analytics.pdfDownloads.byType[type] = 0;
    }
    analytics.pdfDownloads.byType[type] += 1;

    // Update timestamps
    const now = new Date().toISOString();
    if (!analytics.timestamps) {
      analytics.timestamps = {};
    }
    if (!analytics.timestamps.firstEvent) {
      analytics.timestamps.firstEvent = now;
    }
    analytics.timestamps.lastEvent = now;

    // Save analytics
    const dataDir = join(process.cwd(), 'data');
    const { mkdir } = await import('fs/promises');
    await mkdir(dataDir, { recursive: true });
    await writeFile(ANALYTICS_FILE_PATH, JSON.stringify(analytics, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error tracking PDF download:', error);
  }
}

const checklistData = {
  title: "The Developer-Ready Design Checklist",
  subtitle: "9 Critical Specs for Production-Grade Handoffs",
  author: "Kevin Arthur | kevinarthur.design",
  sections: [
    {
      title: "1. Component Architecture & Edge Cases",
      items: [
        {
          number: 1,
          title: "Token & Naming Alignment",
          description: "Are components and design tokens named to strictly map to the codebase architecture?",
          example: "Use semantic tokens (e.g., color-text-primary) instead of absolute values.",
          checkpoints: [
            "Component names match front-end conventions (e.g., PascalCase)",
            "Prop names and variants are defined and documented",
            "Design tokens (colors, spacing, typography) are used consistently without detached values"
          ]
        },
        {
          number: 2,
          title: "Exhaustive State Management",
          description: "Have all interactive and edge-case states been designed and documented?",
          checkpoints: [
            "Interactive states defined (Default, Hover, Active, Focus, Disabled)",
            "System states defined (Loading Skeletons, Spinners, Error boundaries)",
            "Content edge cases (Empty states, Zero-data, Error states)",
            "Data overflow rules (Truncation vs. Wrapping, max-heights, scrollbars)"
          ]
        },
        {
          number: 3,
          title: "Responsive & Fluid Behaviors",
          description: "Are structural behaviors mapped across all layout shifts?",
          checkpoints: [
            "Fixed vs. fluid container behaviors defined (min/max widths)",
            "Breakpoints clearly established (Mobile, Tablet, Desktop, Ultra-wide)",
            "Component reorganization rules across viewports provided",
            "Navigation transitions (e.g., Hamburger menu morphs) documented"
          ]
        }
      ]
    },
    {
      title: "2. Accessibility & Compliance",
      items: [
        {
          number: 4,
          title: "Contrast & Visual Legibility",
          description: "Does the design meet WCAG 2.1 AA+ contrast requirements?",
          checkpoints: [
            "Text contrast ratios pass 4.5:1 (Normal) and 3:1 (Large text)",
            "UI components/borders pass 3:1 contrast ratio",
            "Dark mode palette strictly audited for eye-strain and legibility",
            "Color is never used as the sole indicator of state (errors have icons)"
          ]
        },
        {
          number: 5,
          title: "Semantic & Keyboard Navigation",
          description: "Is the interface navigable without a mouse?",
          checkpoints: [
            "Logical heading hierarchies established (H1 -> H6)",
            "Focus ring styles documented and aesthetically integrated",
            "Tab order annotated for complex overlays and modals",
            "ARIA tags or screen-reader only text noted where necessary"
          ]
        },
        {
          number: 6,
          title: "Motion & Cognitive Load",
          description: "Are animations intentional and respectful of user preferences?",
          checkpoints: [
            "Reduced motion fallbacks provided for critical animations",
            "No animations flash more than 3 times per second",
            "Sufficient time allowed for auto-advancing carousels or toasts"
          ]
        }
      ]
    },
    {
      title: "3. Implementation Deliverables",
      items: [
        {
          number: 7,
          title: "Asset Readiness",
          description: "Are all visual assets properly exported and optimized?",
          checkpoints: [
            "Vector icons exported as flattened SVGs with consistent viewBoxes",
            "Raster images provided in multiple resolutions (1x, 2x, 3x)",
            "Placeholder/fallback images designated for slow networks",
            "Favicons and OpenGraph social preview images designed"
          ]
        },
        {
          number: 8,
          title: "Motion Orchestration",
          description: "Are spatial transitions and micro-interactions precisely detailed?",
          checkpoints: [
            "Exact cubic-bezier easing curves provided",
            "Duration (ms) and delays mapped for staggered reveals",
            "Transform properties isolated (avoiding CPU-heavy repaints)",
            "Micro-interactions defined (button bounces, toggle slides)"
          ]
        },
        {
          number: 9,
          title: "Form & Input Handling",
          description: "Are data entry workflows bulletproof?",
          checkpoints: [
            "Input modes defined (numeric, email, telephone)",
            "Inline validation and success feedback designed",
            "Destructive actions require confirmation / have undo states",
            "Keyboard layouts specified for mobile inputs"
          ]
        }
      ]
    }
  ],
  footer: {
    cta: "Need Help Shipping Beautiful, Reliable Software?",
    url: "calendly.com/arthurkevin27/15min",
    tagline: "Built from 4+ years designing healthcare AI, SaaS, and fintech products."
  }
};

const auditReportData = {
  title: "AI Readiness Audit Report",
  subtitle: "Personalized Assessment & Recommendations",
  author: "Kevin Arthur | kevinarthur.design",
  categories: [
    {
      name: "Confidence Communication",
      questions: [1, 2],
      description: "How well does your product communicate AI uncertainty and processing states?"
    },
    {
      name: "Error Handling & Recovery",
      questions: [3, 6],
      description: "How gracefully does your product handle AI failures and edge cases?"
    },
    {
      name: "User Control & Feedback",
      questions: [4, 5],
      description: "Can users understand and influence AI decisions?"
    },
    {
      name: "Trust & Transparency",
      questions: [7],
      description: "Do users know when and how much to trust AI outputs?"
    }
  ]
};

function generateQRCodeDataURL(url) {
  return QRCode.toDataURL(url, {
    width: 200,
    margin: 2,
    color: {
      dark: '#1152D4',
      light: '#FFFFFF'
    }
  });
}

function getComparisonPercentile(score) {
  // Simulated percentile based on score
  const maxScore = 14;
  const percentage = (score / maxScore) * 100;
  if (percentage >= 85) return 95;
  if (percentage >= 70) return 82;
  if (percentage >= 55) return 68;
  if (percentage >= 40) return 45;
  if (percentage >= 25) return 28;
  return 15;
}

function getCategoryScore(answers, categoryQuestions) {
  let score = 0;
  let maxScore = 0;
  categoryQuestions.forEach(qId => {
    maxScore += 2;
    score += answers[qId] || 0;
  });
  return { score, maxScore, percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0 };
}

function getCategoryRecommendations(category, scoreData) {
  const recommendations = {
    'Confidence Communication': {
      weak: [
        'Implement tiered confidence states (high/medium/low)',
        'Add contextual loading states that explain what\'s happening',
        'Show confidence percentages for AI predictions'
      ],
      moderate: [
        'Fine-tune confidence thresholds for your use case',
        'Add more detailed loading context for complex operations'
      ],
      strong: [
        'Consider A/B testing confidence presentation',
        'Document your confidence communication patterns'
      ]
    },
    'Error Handling & Recovery': {
      weak: [
        'Design graceful degradation patterns',
        'Add fallback options for AI failures',
        'Create clear error recovery flows'
      ],
      moderate: [
        'Add retry mechanisms with exponential backoff',
        'Improve error messaging with specific next steps'
      ],
      strong: [
        'Monitor error patterns for continuous improvement',
        'Consider self-healing mechanisms for common failures'
      ]
    },
    'User Control & Feedback': {
      weak: [
        'Implement explicit human override patterns',
        'Add clear correction flows with feedback mechanism',
        'Show AI reasoning behind recommendations'
      ],
      moderate: [
        'Improve the clarity of AI explanations',
        'Add more granular control options for users'
      ],
      strong: [
        'Consider learning from user corrections',
        'Add advanced explanation modes for power users'
      ]
    },
    'Trust & Transparency': {
      weak: [
        'Add context-specific trust guidance',
        'Implement confidence-based UI adjustments',
        'Clear documentation of AI limitations'
      ],
      moderate: [
        'Refine trust indicators based on use case',
        'Add more granular trust levels'
      ],
      strong: [
        'Consider trust calibration features',
        'Document trust patterns for your team'
      ]
    }
  };

  const categoryRecs = recommendations[category.name];
  if (!categoryRecs) return [];

  if (scoreData.percentage < 50) return categoryRecs.weak;
  if (scoreData.percentage < 80) return categoryRecs.moderate;
  return categoryRecs.strong;
}

async function generateAIAuditPDF(recipientName = null, answers = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Colors
  const primaryColor = [17, 82, 212];
  const textColor = [9, 9, 11];
  const mutedColor = [102, 102, 112];
  const bgColor = [252, 252, 253];
  const cardColor = [246, 246, 248];
  const successColor = [34, 197, 94];
  const warningColor = [245, 158, 11];
  const dangerColor = [239, 68, 68];

  const checkPageBreak = (requiredSpace) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      doc.setFillColor(...bgColor);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      yPos = margin + 10;
      return true;
    }
    return false;
  };

  // Title Page Background
  doc.setFillColor(...bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Accent bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 4, 'F');

  yPos = 40;

  // Personalized greeting
  if (recipientName) {
    doc.setFillColor(...cardColor);
    doc.setDrawColor(229, 231, 235);
    const textWidth = doc.getTextWidth(`Prepared for ${recipientName}`);
    doc.roundedRect((pageWidth / 2) - (textWidth / 2) - 10, yPos - 5, textWidth + 20, 10, 5, 5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(`Prepared for ${recipientName}`, pageWidth / 2, yPos + 1.5, { align: 'center' });
    yPos += 20;
  } else {
    yPos = 50;
  }

  // Main title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...textColor);
  doc.text(auditReportData.title, pageWidth / 2, yPos, { align: 'center' });

  yPos += 14;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...mutedColor);
  doc.text(auditReportData.subtitle, pageWidth / 2, yPos, { align: 'center' });

  yPos += 25;

  // Calculate total score
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  const maxScore = 14;
  const percentile = getComparisonPercentile(totalScore);

  // Score Display
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(235, 235, 240);
  doc.roundedRect(margin + 5, yPos, contentWidth - 10, 50, 4, 4, 'FD');

  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('YOUR AI READINESS SCORE', pageWidth / 2, yPos, { align: 'center' });

  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(...textColor);
  doc.text(`${totalScore}/${maxScore}`, pageWidth / 2, yPos, { align: 'center' });

  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...mutedColor);
  doc.text(`You scored higher than ${percentile}% of participants`, pageWidth / 2, yPos, { align: 'center' });

  yPos += 60;

  // Author
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...mutedColor);
  doc.text(auditReportData.author, pageWidth / 2, yPos, { align: 'center' });

  // Content Pages
  doc.addPage();
  doc.setFillColor(...bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  yPos = margin + 10;

  // Category Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...textColor);
  doc.text('Score Breakdown by Category', margin, yPos);

  yPos += 15;

  auditReportData.categories.forEach((category, index) => {
    checkPageBreak(40);

    const scoreData = getCategoryScore(answers, category.questions);
    const barColor = scoreData.percentage >= 70 ? successColor : scoreData.percentage >= 40 ? warningColor : dangerColor;

    // Category card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(235, 235, 240);
    doc.roundedRect(margin + 5, yPos, contentWidth - 10, 35, 4, 4, 'FD');

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text(category.name, margin + 13, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedColor);
    doc.text(category.description, margin + 13, yPos);

    yPos += 8;
    // Progress bar
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin + 13, yPos, contentWidth - 30, 6, 3, 3, 'F');
    doc.setFillColor(...barColor);
    const barWidth = ((contentWidth - 30) * scoreData.percentage) / 100;
    doc.roundedRect(margin + 13, yPos, barWidth, 6, 3, 3, 'F');

    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...barColor);
    doc.text(`${scoreData.score}/${scoreData.maxScore} (${scoreData.percentage}%)`, margin + 13, yPos);

    yPos += 12;
  });

  // Recommendations Page
  doc.addPage();
  doc.setFillColor(...bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  yPos = margin + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...textColor);
  doc.text('Personalized Recommendations', margin, yPos);

  yPos += 15;

  auditReportData.categories.forEach((category, index) => {
    checkPageBreak(40);

    const scoreData = getCategoryScore(answers, category.questions);
    const recommendations = getCategoryRecommendations(category, scoreData);

    if (recommendations.length === 0) return;

    // Category header
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(2);
    doc.line(margin, yPos - 3, margin, yPos + 2);

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...textColor);
    doc.text(`${category.name} (${scoreData.percentage}%)`, margin + 5, yPos);

    yPos += 8;

    recommendations.forEach((rec, i) => {
      checkPageBreak(10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...mutedColor);

      const bullet = String.fromCharCode(8226);
      const text = `${bullet} ${rec}`;
      const lines = doc.splitTextToSize(text, contentWidth - 15);
      doc.text(lines, margin + 15, yPos);
      yPos += lines.length * 6;
    });

    yPos += 8;
  });

  // CTA Page with QR Code
  doc.addPage();
  doc.setFillColor(...bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  yPos = margin + 20;

  // Background pane
  doc.setFillColor(...cardColor);
  doc.roundedRect(margin, yPos, contentWidth, 90, 6, 6, 'F');

  // Accent top edge
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, yPos, contentWidth, 3, 6, 6, 'F');
  doc.rect(margin, yPos + 1.5, contentWidth, 1.5, 'F');

  yPos += 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...textColor);
  doc.text('Ready to Improve Your AI Readiness?', pageWidth / 2, yPos, { align: 'center' });

  yPos += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...mutedColor);
  doc.text('Book a free 15-minute consultation to discuss your results', pageWidth / 2, yPos, { align: 'center' });

  yPos += 20;

  // Generate and add QR code
  const calendlyUrl = 'https://calendly.com/arthurkevin27/15min?utm_source=ai_audit_pdf&utm_medium=qr_code';
  const qrCodeDataUrl = await generateQRCodeDataURL(calendlyUrl);

  try {
    doc.addImage(qrCodeDataUrl, 'PNG', (pageWidth / 2) - 20, yPos, 40, 40);
  } catch (error) {
    console.error('Error adding QR code to PDF:', error);
  }

  yPos += 45;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('calendly.com/arthurkevin27/15min', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.text('Scan to book your consultation', pageWidth / 2, yPos, { align: 'center' });

  return doc.output('arraybuffer');
}

async function generatePDF(recipientName = null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Colors (Derived from kevin-arthur-portfolio globals.css)
  const primaryColor = [17, 82, 212];     // Primary blue
  const textColor = [9, 9, 11];           // Foreground dark zinc
  const mutedColor = [102, 102, 112];     // Muted gray-zinc
  const bgColor = [252, 252, 253];        // Ultra-light background
  const cardColor = [246, 246, 248];      // Soft card background

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      // Apply background to new pages
      doc.setFillColor(...bgColor);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      yPos = margin + 10;
      return true;
    }
    return false;
  };

  // Title Page Background
  doc.setFillColor(...bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Accent bar (premium subtle line)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 4, 'F');

  yPos = 40;

  // Personalized greeting if name provided
  if (recipientName) {
    // Elegant pill shape
    doc.setFillColor(...cardColor);
    doc.setDrawColor(229, 231, 235);
    const textWidth = doc.getTextWidth(`Prepared for ${recipientName}`);
    doc.roundedRect((pageWidth / 2) - (textWidth / 2) - 10, yPos - 5, textWidth + 20, 10, 5, 5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(`Prepared for ${recipientName}`, pageWidth / 2, yPos + 1.5, { align: 'center' });
    yPos += 20;
  } else {
    yPos = 50;
  }

  // Main title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...textColor);
  doc.text(checklistData.title, pageWidth / 2, yPos, { align: 'center' });

  yPos += 14;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...mutedColor);
  doc.text(checklistData.subtitle, pageWidth / 2, yPos, { align: 'center' });

  yPos += 25;

  // Decorative element (premium subtle line)
  doc.setDrawColor(229, 231, 235); // Very light gray line
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 20, yPos, pageWidth / 2 + 20, yPos);

  yPos += 25;

  // Quick overview box (Cleaner, more padding)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(235, 235, 240);
  doc.roundedRect(margin + 5, yPos, contentWidth - 10, 60, 4, 4, 'FD');

  yPos += 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('WHAT THIS CHECKLIST COVERS', margin + 18, yPos);

  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...mutedColor);

  const overviewItems = [
    '✓ Component Architecture & Edge Cases',
    '✓ Accessibility & Compliance Standards',
    '✓ Implementation Deliverables & Motion'
  ];

  overviewItems.forEach((item, i) => {
    doc.text(item, margin + 18, yPos + (i * 9));
  });

  yPos += 55;

  // Author
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...mutedColor);
  doc.text(checklistData.author, pageWidth / 2, yPos, { align: 'center' });

  // Footer on title page
  doc.setFontSize(9);
  doc.text(checklistData.footer.tagline, pageWidth / 2, pageHeight - 20, { align: 'center' });

  // Content Pages
  doc.addPage();
  doc.setFillColor(...bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  yPos = margin + 10;

  checklistData.sections.forEach((section, sectionIndex) => {
    checkPageBreak(30);

    // Section header (Clean typography instead of color block)
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(2.5);
    doc.line(margin, yPos - 5, margin, yPos + 3); // Left accent line

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...textColor);
    doc.text(section.title, margin + 6, yPos + 2);

    yPos += 20;

    section.items.forEach((item, itemIndex) => {
      const itemHeight = 15 + (item.checkpoints.length * 6) + (item.example ? 12 : 0);
      checkPageBreak(itemHeight);

      // Item number chip (subtle background, primary text)
      doc.setFillColor(235, 240, 255); // Very light blue matching primary
      doc.roundedRect(margin + 5, yPos, 16, 6, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...primaryColor);
      doc.text(`ITEM ${item.number}`, margin + 13, yPos + 4.2, { align: 'center' });

      // Item title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.text(item.title, margin + 26, yPos + 4.5);

      yPos += 12;

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...mutedColor);
      const descLines = doc.splitTextToSize(item.description, contentWidth - 26);
      doc.text(descLines, margin + 26, yPos);
      yPos += descLines.length * 5.5;

      // Example if present
      if (item.example) {
        doc.setFillColor(...cardColor);
        doc.roundedRect(margin + 26, yPos, contentWidth - 26, 9, 2, 2, 'F');
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(...textColor);
        doc.text(`Example: ${item.example}`, margin + 30, yPos + 6);
        yPos += 11;
      }

      yPos += 3;

      // Checkpoints
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...textColor);

      item.checkpoints.forEach((checkpoint) => {
        checkPageBreak(7);
        // Checkbox (rounded, softer)
        doc.setDrawColor(200, 200, 210); // lighter gray
        doc.setLineWidth(0.4);
        doc.roundedRect(margin + 26, yPos - 3, 3.5, 3.5, 0.5, 0.5, 'S');

        // Checkpoint text
        const checkpointLines = doc.splitTextToSize(checkpoint, contentWidth - 36);
        doc.text(checkpointLines, margin + 33, yPos);
        yPos += checkpointLines.length * 6;
      });

      yPos += 12;
    });

    yPos += 10;
  });

  // Final CTA page (Clean & minimal)
  checkPageBreak(100);

  yPos += 20;

  // Background pane
  doc.setFillColor(...cardColor);
  doc.roundedRect(margin, yPos, contentWidth, 85, 6, 6, 'F');

  // Accent top edge
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, yPos, contentWidth, 3, 6, 6, 'F');
  // Cover bottom rounded corners of the top stripe
  doc.rect(margin, yPos + 1.5, contentWidth, 1.5, 'F');

  yPos += 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...textColor);
  doc.text(checklistData.footer.cta, pageWidth / 2, yPos, { align: 'center' });

  yPos += 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text(checklistData.footer.url, pageWidth / 2, yPos, { align: 'center' });

  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...mutedColor);
  doc.text('Book a free 15-minute call:', pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;

  // Generate and add QR code
  const calendlyUrl = 'https://calendly.com/arthurkevin27/15min?utm_source=checklist_pdf&utm_medium=qr_code';
  const qrCodeDataUrl = await generateQRCodeDataURL(calendlyUrl);

  try {
    doc.addImage(qrCodeDataUrl, 'PNG', (pageWidth / 2) - 20, yPos, 40, 40);
  } catch (error) {
    console.error('Error adding QR code to PDF:', error);
  }

  yPos += 45;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.text('Scan to book your consultation', pageWidth / 2, yPos, { align: 'center' });

  return doc.output('arraybuffer');
}

export async function GET(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const rateLimitResult = checkRateLimit(ip, 'generate-checklist-pdf');

    if (!rateLimitResult.allowed) {
      const headers = getRateLimitHeaders(rateLimitResult);
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429, headers }
      );
    }

    // Check for preview mode from query param or body
    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get('preview') === 'true';
    const name = searchParams.get('name');

    const pdfBuffer = await generatePDF(name);
    const filename = name
      ? `Developer-Ready-Design-Checklist-for-${name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      : 'Developer-Ready-Design-Checklist.pdf';

    // Track PDF download (fire and forget)
    trackPDFDownload('checklist').catch(console.error);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': isPreview ? 'inline' : `attachment; filename="${filename}"`,
        'Cache-Control': name ? 'no-cache' : 'public, max-age=86400',
        ...getRateLimitHeaders(rateLimitResult),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const rateLimitResult = checkRateLimit(ip, 'generate-checklist-pdf');

    if (!rateLimitResult.allowed) {
      const headers = getRateLimitHeaders(rateLimitResult);
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429, headers }
      );
    }

    const body = await request.json();
    const { name, email, type, answers, preview } = body;

    let pdfBuffer;
    let filename;

    if (type === 'ai-audit') {
      // Generate AI Audit Report
      pdfBuffer = await generateAIAuditPDF(name, answers);
      filename = name
        ? `AI-Readiness-Audit-for-${name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
        : 'AI-Readiness-Audit.pdf';
    } else {
      // Generate Design Checklist PDF (default)
      pdfBuffer = await generatePDF(name);
      filename = name
        ? `Developer-Ready-Design-Checklist-for-${name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
        : 'Developer-Ready-Design-Checklist.pdf';
    }

    // Track PDF download (fire and forget)
    trackPDFDownload(type === 'ai-audit' ? 'ai-audit' : 'checklist').catch(console.error);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': preview ? 'inline' : `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
