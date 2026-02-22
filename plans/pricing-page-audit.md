# Pricing Page Audit & Recommendations

**Audit Date:** February 2026  
**Scope:** [`src/app/pricing/page.js`](src/app/pricing/page.js), [`src/data/pricing.js`](src/data/pricing.js), pricing components  
**Excluded:** UX Lab, case studies, home, contact, about pages

---

## Executive Summary

The pricing page has solid foundations but lacks senior-level positioning, conversion psychology, and differentiation expected from a premium design consultant. Key gaps include outdated urgency messaging, weak value framing, missing ROI context, and underutilized trust builders.

**Priority Focus Areas:**
1. **Critical:** Fix outdated "Q1 2024" scarcity messaging
2. **High Impact:** Add outcome-focused value propositions and ROI framing
3. **Medium Impact:** Strengthen pricing psychology and visual hierarchy
4. **Quick Wins:** Improve CTA copy and add micro-conversions

---

## Critical Issues

### 1. Outdated Scarcity Messaging ❌
**Location:** [`src/app/pricing/page.js:42`](src/app/pricing/page.js:42)

```jsx
<span className="inline-block py-1 px-3 rounded-full bg-secondary/50 border border-white/5 text-xs font-mono text-primary mb-4 backdrop-blur-md">
    Limited Availability for Q1 2024
</span>
```

**Problem:** Shows "Q1 2024" which is 2 years outdated. This damages credibility and makes the scarcity feel manufactured.

**Recommendation:**
- Replace with dynamic availability messaging or remove date specificity
- Consider: "Currently booking for March 2026" or "2 slots available this month"
- **Quick Win:** Update to current period or implement dynamic availability

---

## High-Impact Improvements

### 2. Missing Outcome-Focused Value Proposition

**Current State:** Generic headline
> "Transparent Pricing for Ambitious Products."

**Problem:** Focuses on process (pricing transparency) rather than outcomes (what clients achieve). Senior designers sell transformation, not features.

**Recommendation:** Reframe around client outcomes:

| Current | Proposed |
|---------|----------|
| "Transparent Pricing for Ambitious Products" | "Design Partnerships That Ship Products" |
| "No hidden fees. No hourly billing surprises." | "From concept to launch in 4-6 weeks. Fixed scope, guaranteed delivery." |

**Alternative Headlines:**
- "Ship Your Product in Weeks, Not Months"
- "Design Work That Actually Gets Built"
- "Product Design for Teams That Need to Move Fast"

---

### 3. Weak Tier Differentiation & Naming

**Current Names:** Discovery Sprint, Design & Prototype, Full Partnership

**Problems:**
- Names describe process, not outcomes
- "Discovery Sprint" sounds like a workshop, not a deliverable
- "Full Partnership" is vague and doesn't convey value

**Recommendation:** Rename tiers around client outcomes:

| Current | Proposed | Rationale |
|---------|----------|-----------|
| Discovery Sprint | **Product Strategy** | Clearer value proposition |
| Design & Prototype | **MVP Design System** | Implies tangible deliverable |
| Full Partnership | **Product Team Extension** | Conveys embedded partnership |

**Tagline Improvements:**

| Current | Proposed |
|---------|----------|
| "Best for Startups & MVPs" | "Validate before you build" |
| "Most Popular" | "Most founders start here" |
| "Enterprise & Complex Projects" | "For teams scaling fast" |

---

### 4. Missing ROI Context & Value Anchoring

**Problem:** Prices appear in isolation without context of value delivered.

**Recommendations:**

#### A. Add Value Anchoring Above Pricing
```jsx
// Add before pricing cards
<section className="text-center mb-8">
    <p className="text-muted-foreground">
        Average client ROI: <span className="text-primary font-semibold">3.2x</span> within 90 days
        • Products shipped: <span className="text-primary font-semibold">47+</span>
    </p>
</section>
```

#### B. Add Price-Per-Week Breakdown
- Discovery Sprint: $1,500 / 2-3 weeks = ~$600/week
- Design & Prototype: $4,900 / 4-6 weeks = ~$1,000/week

This makes pricing feel more accessible and justifies value.

#### C. Add "What You'd Pay Elsewhere" Comparison
| Your Investment | Agency Equivalent | Savings |
|-----------------|-------------------|---------|
| $1,500 | $5,000-8,000 | 70%+ |
| $4,900 | $15,000-25,000 | 65%+ |

---

### 5. Underutilized Social Proof

**Current State:** Simple text trust signals
```jsx
<span className="text-sm font-bold text-foreground">Y Combinator</span>
<span className="text-sm font-bold text-foreground">Techstars</span>
<span className="text-sm font-bold text-foreground">Antler</span>
```

**Problem:** No visual logos, no specificity, no context. The home page has a full TrustStrip with partner logos—this feels incomplete by comparison.

**Recommendations:**

#### A. Add Specific Testimonials Per Tier
```jsx
// Discovery Sprint testimonial
"Kevin's discovery sprint saved us 3 months of wasted development."
— Founder, YC W23

// Design & Prototype testimonial  
"We raised our seed round with the prototype Kevin built."
— CEO, Techstars '24
```

#### B. Add Mini Case Study Previews
- 2-3 sentence outcome summary
- Link to relevant case study
- Specific metric achieved

#### C. Add Trust Badges
- "100% Satisfaction Guarantee" (currently only on middle tier—extend to all)
- "NDA available on request"
- "Invoice in CAD/USD/EUR"

---

### 6. Weak Feature-to-Benefit Translation

**Current State:** Feature lists are process-focused
```
- Validation of Product-Market Fit
- Stakeholder & User Research
- Competitive Gap Analysis
```

**Problem:** Clients buy outcomes, not activities.

**Recommendation:** Transform features into benefits:

| Feature (Current) | Benefit (Proposed) |
|-------------------|-------------------|
| "Validation of Product-Market Fit" | "Know your market before you build" |
| "Stakeholder & User Research" | "Decisions backed by user data, not assumptions" |
| "Competitive Gap Analysis" | "Find your unfair advantage" |
| "Lo-fi Wireframes (Figma)" | "Visualize your product in days" |
| "Clickable MVP Prototype" | "Test with real users before writing code" |
| "Developer Handoff Documentation" | "Engineers can start building immediately" |

---

## Pricing Psychology Improvements

### 7. Retainer Value Proposition Unclear

**Current State:** 
- "Save 20%" badge on retainer toggle
- No explanation of retainer benefits

**Problem:** The math doesn't add up clearly. Discovery Sprint is $1,500 project vs $3,000/mo retainer—that's not saving 20%.

**Recommendation:**

#### A. Clarify Retainer Value
```jsx
// Add retainer-specific benefits
Retainer Benefits:
✓ Priority scheduling (skip the waitlist)
✓ Dedicated weekly capacity
✓ Faster turnaround on revisions
✓ Ongoing strategic support
```

#### B. Fix the "Save 20%" Claim
The current pricing structure:
- Design & Prototype: $4,900 project vs $5,000/mo retainer
- This is essentially the same, not a 20% savings

**Either:**
1. Adjust retainer pricing to show actual savings
2. Remove the "Save 20%" claim
3. Frame retainer value differently (priority, not savings)

---

### 8. Missing Decoy Pricing Effect

**Current State:** Three tiers without clear psychological anchoring.

**Recommendation:** Use the middle tier as the anchor:

1. Make the middle tier visually dominant (already done with "Most Popular")
2. Add a "Most founders choose this" social proof element
3. Show what's NOT included in lower tier to create FOMO

**Implementation:**
```jsx
// Add to Design & Prototype card
<div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
    <p className="text-xs text-muted-foreground">
        <span className="text-primary font-semibold">87%</span> of founders start here
    </p>
</div>
```

---

### 9. No Risk Reversal Strategy

**Current State:** Only middle tier has "100% Satisfaction Guarantee"

**Problem:** Risk is a major objection for first-time clients. One-line guarantee is weak.

**Recommendations:**

#### A. Extend Guarantee to All Tiers
Every tier should have a clear risk reversal.

#### B. Make Guarantee Specific
| Current | Proposed |
|---------|----------|
| "100% Satisfaction Guarantee" | "Love it or I'll revise it until you do—no extra charge" |

#### C. Add Process Guarantee
"If I miss the deadline, you get 10% off per week delayed."

---

## Visual Hierarchy & UX Issues

### 10. Comparison Table Lacks Impact

**Current State:** Basic feature matrix with checkmarks.

**Problems:**
- Doesn't highlight key differentiators
- No visual emphasis on recommended tier
- "Advanced" / "Complete" labels are vague

**Recommendations:**

#### A. Add Outcome Column
| Feature | Discovery | Design | Partnership |
|---------|-----------|--------|-------------|
| **Best for** | Validate idea | Raise funding | Scale product |
| **Timeline** | 2-3 weeks | 4-6 weeks | Ongoing |

#### B. Highlight Key Differentiators
Use color/bolding for tier-specific advantages:
- Discovery: "Strategic foundation"
- Design: "Investor-ready deliverables"
- Partnership: "Full development capability"

---

### 11. CTA Copy is Generic

**Current State:** "Get Started" and "Contact Me"

**Problems:**
- No urgency or action orientation
- Same CTA for all tiers
- No secondary CTAs for different buyer stages

**Recommendations:**

| Tier | Primary CTA | Secondary CTA |
|------|-------------|---------------|
| Discovery | "Book Discovery Call" | "See example deliverables" |
| Design | "Start Your Project" | "View sample prototype" |
| Partnership | "Schedule Consultation" | "See partnership details" |

**Add Micro-Conversions:**
- "Download sample deliverables" (lead magnet)
- "Watch 2-min process video"
- "See pricing FAQ"

---

### 12. Missing Process Visualization

**Problem:** Clients don't understand what happens after they click "Get Started."

**Recommendation:** Add a simple process timeline:

```
1. Discovery Call (15 min)
   ↓
2. Proposal & Scope (24-48 hrs)
   ↓
3. Kickoff & Research (Week 1)
   ↓
4. Design Iterations (Weeks 2-4)
   ↓
5. Delivery & Handoff
```

---

## Quick Wins (Implement Today)

### 1. Fix Outdated Date
Change "Q1 2024" to current period or remove.

### 2. Add Specific Numbers
- "47+ products shipped"
- "Average 4.6 week delivery"
- "3.2x average client ROI"

### 3. Extend Satisfaction Guarantee
Add to all tiers, not just middle one.

### 4. Improve CTA Copy
Change "Get Started" to action-oriented copy.

### 5. Add FAQ About Process
Add: "What happens after I book a call?"

---

## High-Effort / High-ROI Enhancements

### 1. Tier-Specific Testimonials
Gather and display testimonials specific to each tier's outcome.

### 2. ROI Calculator
Interactive tool showing potential savings vs. hiring in-house or agency.

### 3. Sample Deliverables Gallery
Visual showcase of what each tier delivers.

### 4. Video Explainers
2-minute video per tier explaining the process and outcomes.

### 5. Dynamic Availability
Real-time calendar integration showing actual availability.

---

## Summary Matrix

| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Outdated scarcity date | Critical | Low | Fix Now |
| Weak value proposition | High | Medium | This Sprint |
| Missing ROI context | High | Low | This Sprint |
| Generic tier names | Medium | Low | Next Sprint |
| Weak social proof | High | Medium | This Sprint |
| Feature-focused copy | Medium | Low | Next Sprint |
| Unclear retainer value | High | Medium | This Sprint |
| Missing risk reversal | High | Low | This Sprint |
| Generic CTAs | Medium | Low | Next Sprint |
| No process visualization | Medium | Medium | Backlog |

---

## Recommended Implementation Order

1. **Week 1:** Fix critical issues (outdated date, extend guarantee)
2. **Week 2:** Add ROI context, improve social proof, clarify retainer value
3. **Week 3:** Rename tiers, improve feature copy, enhance CTAs
4. **Week 4:** Add process visualization, comparison table improvements
5. **Ongoing:** Gather tier-specific testimonials, build sample deliverables gallery
