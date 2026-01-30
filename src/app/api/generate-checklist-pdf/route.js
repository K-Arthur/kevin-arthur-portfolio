import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

const checklistData = {
  title: "The Developer-Ready Design Checklist",
  subtitle: "12 Critical Specs for Perfect Design-to-Dev Handoffs",
  author: "Kevin Arthur | kevinarthur.design",
  sections: [
    {
      title: "Section 1: Component Architecture",
      items: [
        {
          number: 1,
          title: "Component Naming Convention",
          description: "Are components named consistently with how developers will reference them in code?",
          example: "Use 'PrimaryButton', not 'big blue button'",
          checkpoints: [
            "Names follow PascalCase or camelCase conventions",
            "Names match intended code component names",
            "Variants are clearly labeled (e.g., ButtonPrimary, ButtonSecondary)"
          ]
        },
        {
          number: 2,
          title: "State Documentation",
          description: "Are all interactive states defined for each component?",
          checkpoints: [
            "Default state",
            "Hover state",
            "Active/Pressed state",
            "Disabled state",
            "Loading state",
            "Error state",
            "Empty state (where applicable)"
          ]
        },
        {
          number: 3,
          title: "Responsive Breakpoints",
          description: "Are designs provided at all critical viewport widths?",
          checkpoints: [
            "Mobile: 375px (minimum)",
            "Tablet: 768px",
            "Desktop: 1440px",
            "Layout behavior between breakpoints documented"
          ]
        }
      ]
    },
    {
      title: "Section 2: Design Token Readiness",
      items: [
        {
          number: 4,
          title: "Color System Defined",
          description: "Are all colors documented with semantic names and values?",
          checkpoints: [
            "Primary, secondary, accent colors defined",
            "Semantic names used (--color-primary, not 'brand blue')",
            "Hex/RGB/HSL values provided",
            "Dark mode variants (if applicable)"
          ]
        },
        {
          number: 5,
          title: "Typography Scale",
          description: "Is there a clear type hierarchy with specific values?",
          checkpoints: [
            "Font families specified",
            "Size scale defined (px or rem)",
            "Font weights for each level",
            "Line heights specified",
            "Letter spacing (if non-default)"
          ]
        },
        {
          number: 6,
          title: "Spacing System",
          description: "Are spacing values consistent and based on a base unit?",
          checkpoints: [
            "Base unit defined (e.g., 4px or 8px)",
            "Spacing scale documented (4, 8, 16, 24, 32, 48, 64)",
            "Component padding/margins use scale values",
            "Grid gutters follow spacing system"
          ]
        }
      ]
    },
    {
      title: "Section 3: Interaction Specifications",
      items: [
        {
          number: 7,
          title: "Animation Timing",
          description: "Are transitions and animations specified with duration and easing?",
          checkpoints: [
            "Duration specified (e.g., 200ms, 300ms)",
            "Easing function defined (ease-out, ease-in-out, cubic-bezier)",
            "Which properties animate (opacity, transform, etc.)",
            "Reduced motion alternatives considered"
          ]
        },
        {
          number: 8,
          title: "Loading States",
          description: "Is every async action accompanied by a loading state design?",
          checkpoints: [
            "Button loading states",
            "Page/section skeleton loaders",
            "Progress indicators for long operations",
            "Contextual loading messages"
          ]
        },
        {
          number: 9,
          title: "Error Handling",
          description: "Are error states designed for all failure scenarios?",
          checkpoints: [
            "Form validation errors (inline + summary)",
            "API/network failure states",
            "Empty states with actionable guidance",
            "404 and error page designs"
          ]
        }
      ]
    },
    {
      title: "Section 4: Asset Delivery",
      items: [
        {
          number: 10,
          title: "Icon Export Specs",
          description: "Are icons provided in developer-friendly formats?",
          checkpoints: [
            "SVG format with consistent viewBox",
            "Consistent stroke widths across icon set",
            "Named exports matching intended usage",
            "Multiple sizes if needed (16px, 24px, 32px)"
          ]
        },
        {
          number: 11,
          title: "Image Requirements",
          description: "Are image dimensions and behaviors documented?",
          checkpoints: [
            "Aspect ratios specified",
            "Minimum/maximum dimensions",
            "Fallback/placeholder designs",
            "Responsive image behavior (crop vs. scale)"
          ]
        },
        {
          number: 12,
          title: "Accessibility Annotations",
          description: "Are accessibility requirements specified in designs?",
          checkpoints: [
            "Focus states for interactive elements",
            "Color contrast ratios (4.5:1 for text, 3:1 for UI)",
            "ARIA labels for icons and complex components",
            "Tab order annotations for complex layouts",
            "Screen reader text for visual-only content"
          ]
        }
      ]
    }
  ],
  footer: {
    cta: "Need help implementing these practices?",
    url: "calendly.com/arthurkevin27/15min",
    tagline: "Built from 4+ years designing healthcare AI, SaaS, and fintech products."
  }
};

function generatePDF(recipientName = null) {
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
  const primaryColor = [99, 102, 241]; // Indigo
  const textColor = [31, 41, 55];
  const mutedColor = [107, 114, 128];
  const bgColor = [249, 250, 251];
  const accentColor = [16, 185, 129]; // Emerald for personalization

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Title Page
  doc.setFillColor(...bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Accent bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 8, 'F');

  yPos = 40;

  // Personalized greeting if name provided
  if (recipientName) {
    doc.setFillColor(...accentColor);
    doc.roundedRect(margin + 30, yPos - 5, contentWidth - 60, 14, 7, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`Prepared for ${recipientName}`, pageWidth / 2, yPos + 3, { align: 'center' });
    yPos += 25;
  } else {
    yPos = 60;
  }

  // Main title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...textColor);
  doc.text(checklistData.title, pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(...mutedColor);
  doc.text(checklistData.subtitle, pageWidth / 2, yPos, { align: 'center' });

  yPos += 30;

  // Decorative line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin + 40, yPos, pageWidth - margin - 40, yPos);

  yPos += 20;

  // Quick overview box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, yPos, contentWidth, 60, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, yPos, contentWidth, 60, 3, 3, 'S');

  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.text('What This Checklist Covers:', margin + 8, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...mutedColor);

  const overviewItems = [
    '✓ Component Architecture — Naming, states, and responsive specs',
    '✓ Design Tokens — Colors, typography, and spacing systems',
    '✓ Interactions — Animations, loading states, and error handling',
    '✓ Asset Delivery — Icons, images, and accessibility annotations'
  ];

  overviewItems.forEach((item, i) => {
    doc.text(item, margin + 8, yPos + (i * 7));
  });

  yPos += 50;

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
  yPos = margin;

  checklistData.sections.forEach((section, sectionIndex) => {
    checkPageBreak(25);

    // Section header
    doc.setFillColor(...primaryColor);
    doc.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(section.title, margin + 5, yPos + 7);

    yPos += 18;

    section.items.forEach((item, itemIndex) => {
      const itemHeight = 15 + (item.checkpoints.length * 6) + (item.example ? 8 : 0);
      checkPageBreak(itemHeight);

      // Item number circle
      doc.setFillColor(...primaryColor);
      doc.circle(margin + 5, yPos + 3, 4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(String(item.number), margin + 5, yPos + 4.5, { align: 'center' });

      // Item title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...textColor);
      doc.text(item.title, margin + 14, yPos + 4);

      yPos += 10;

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...mutedColor);
      const descLines = doc.splitTextToSize(item.description, contentWidth - 14);
      doc.text(descLines, margin + 14, yPos);
      yPos += descLines.length * 5;

      // Example if present
      if (item.example) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(...primaryColor);
        doc.text(`Example: ${item.example}`, margin + 14, yPos);
        yPos += 6;
      }

      yPos += 3;

      // Checkpoints
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...textColor);

      item.checkpoints.forEach((checkpoint) => {
        checkPageBreak(6);
        // Checkbox
        doc.setDrawColor(...mutedColor);
        doc.setLineWidth(0.3);
        doc.rect(margin + 14, yPos - 3, 3.5, 3.5);
        // Checkpoint text
        const checkpointLines = doc.splitTextToSize(checkpoint, contentWidth - 25);
        doc.text(checkpointLines, margin + 20, yPos);
        yPos += checkpointLines.length * 5;
      });

      yPos += 8;
    });

    yPos += 5;
  });

  // Final CTA page
  checkPageBreak(60);

  yPos += 10;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F');
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'S');

  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...textColor);
  doc.text(checklistData.footer.cta, pageWidth / 2, yPos, { align: 'center' });

  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(checklistData.footer.url, pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.text('Book a free 15-minute call:', pageWidth / 2, yPos, { align: 'center' });

  return doc.output('arraybuffer');
}

export async function GET(request) {
  try {
    // Check for name in query params for personalization
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    const pdfBuffer = generatePDF(name);
    const filename = name
      ? `Developer-Ready-Design-Checklist-for-${name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      : 'Developer-Ready-Design-Checklist.pdf';

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': name ? 'no-cache' : 'public, max-age=86400',
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
    const body = await request.json();
    const { name, email } = body;

    // Generate personalized PDF with user's name
    const pdfBuffer = generatePDF(name);
    const filename = name
      ? `Developer-Ready-Design-Checklist-for-${name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      : 'Developer-Ready-Design-Checklist.pdf';

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
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
