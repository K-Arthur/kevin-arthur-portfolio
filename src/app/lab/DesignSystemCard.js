'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClipboardCheck, FaArrowRight, FaEye, FaCheckCircle } from 'react-icons/fa';

export default function DesignSystemCard({ checklistItems }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="glass-premium rounded-3xl p-6 md:p-8 lg:p-10 relative overflow-hidden group flex flex-col lg:flex-row gap-8 lg:gap-10 items-center border-primary/20">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px] transition-colors group-hover:bg-primary/20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-[100px]" />

      <div className="relative z-10 flex-1 space-y-4 lg:max-w-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <FaClipboardCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">Design System Handoff Patterns</h3>
            <p className="text-sm text-muted-foreground">9 specification dimensions</p>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Component specification architecture I developed at MinoHealth to reduce design-dev friction.
          Includes state management matrix, token naming conventions, and accessibility annotations.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <a
            href="/Developer-Ready-Design-Checklist.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-enhanced px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group/btn"
          >
            <span>View Patterns</span>
            <FaArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
          >
            <FaEye className="w-4 h-4" />
            <span>{showPreview ? 'Hide Preview' : 'Preview Contents'}</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 lg:w-2/5 w-full lg:flex-shrink-0">
        <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-xl shadow-primary/5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Specification Dimensions</h4>
          <ul className="space-y-2.5">
            {checklistItems.slice(0, 5).map((item, index) => (
              <li key={index} className="flex items-start gap-3 group/item">
                <FaCheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5 transition-transform group-hover/item:scale-110" />
                <span className="text-sm text-foreground/90 font-medium leading-normal">{item}</span>
              </li>
            ))}
          </ul>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-border/30"
            >
              <ul className="space-y-2.5">
                {checklistItems.slice(5).map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group/item">
                    <FaCheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/90 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {!showPreview && <p className="text-xs text-muted-foreground mt-3">+ 4 more dimensions</p>}
        </div>
      </div>
    </div>
  );
}
