'use client';

import LeadMagnetPopup from '@/components/LeadMagnetPopup';

/**
 * Client wrapper for LeadMagnetPopup on case study pages
 * Shows contextual popup based on case study industry
 */
export default function CaseStudyPopupWrapper({ industry = 'general' }) {
  // Map industry to appropriate lead magnet
  const resource = industry === 'ai' || industry === 'healthtech' 
    ? 'ai-audit' 
    : 'design-checklist';

  return (
    <LeadMagnetPopup
      resource={resource}
      pageType={industry}
      delayMs={60000}
      exitIntent={true}
    />
  );
}
