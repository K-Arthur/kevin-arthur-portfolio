'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFilePdf,
  FaClipboardCheck,
  FaBrain,
  FaClock,
  FaDownload,
  FaPlay,
  FaArrowRight,
  FaStar,
  FaUsers,
  FaFire
} from 'react-icons/fa';
import LeadMagnetForm from './LeadMagnetForm';

/**
 * ResourceCard Component
 * 
 * Displays individual resource cards with download counts,
 * popularity metrics, and waitlist functionality
 */

function ResourceCard({ resource, className = '' }) {
  const [showForm, setShowForm] = useState(false);

  const {
    id,
    title,
    description,
    type,
    status,
    downloadCount,
    completionCount,
    waitlistCount,
    tags,
    featured,
    link,
  } = resource;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'checklist':
        return FaClipboardCheck;
      case 'quiz':
        return FaBrain;
      case 'pdf':
        return FaFilePdf;
      default:
        return FaFilePdf;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'checklist':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'quiz':
        return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'pdf':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available
          </span>
        );
      case 'coming-soon':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/20 shadow-sm">
            <FaClock className="w-2.5 h-2.5" />
            Waitlist
          </span>
        );
      case 'concept':
        return (
          <span className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-border shadow-sm">
            Concept
          </span>
        );
      default:
        return null;
    }
  };

  const TypeIcon = getTypeIcon(type);
  const typeColor = getTypeColor(type);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-premium rounded-2xl p-4 sm:p-6 relative h-full overflow-hidden group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 ${featured ? 'ring-1 ring-primary/30 bg-primary/[0.02]' : ''} ${className}`}
      aria-label={`${title} - ${type}`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -right-12 top-6 rotate-45 z-10">
          <div className="bg-primary text-primary-foreground text-[10px] font-bold py-1 px-12 uppercase tracking-widest shadow-lg">
            Featured
          </div>
        </div>
      )}

      {/* Type Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${typeColor}`}>
          <TypeIcon className="w-3.5 h-3.5" />
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        {getStatusBadge(status)}
      </div>

      {/* Content */}
      <div className="space-y-4 flex-1">
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-[10px] px-2 py-0.5 bg-primary/5 rounded-md text-muted-foreground font-medium border border-primary/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/10">
          {downloadCount !== undefined && downloadCount > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              <FaDownload className="w-3 h-3" />
              <span>{downloadCount.toLocaleString()}</span>
            </div>
          )}
          {completionCount !== undefined && completionCount > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              <FaUsers className="w-3 h-3" />
              <span>{completionCount.toLocaleString()}</span>
            </div>
          )}
          {waitlistCount !== undefined && waitlistCount > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              <FaUsers className="w-3 h-3" />
              <span>{waitlistCount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="mt-6 pt-6 border-t border-border/10">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.button
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (status === 'available') {
                  setShowForm(true);
                } else if (link) {
                  window.open(link, '_blank');
                }
              }}
              className="w-full group/btn inline-flex items-center justify-center gap-2 btn-primary-enhanced font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/10"
              disabled={status === 'concept'}
            >
              {status === 'available' ? (
                <>
                  <span>Get Resource</span>
                  <FaArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </>
              ) : status === 'coming-soon' ? (
                <>
                  <span>Join Waitlist</span>
                  <FaArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </>
              ) : (
                <span>Coming Soon</span>
              )}
            </motion.button>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <LeadMagnetForm
                resource={id}
                buttonText={status === 'coming-soon' ? 'Join Waitlist' : 'Get Resource'}
                successMessage={status === 'coming-soon' ? "You're on the waitlist! We'll notify you when it's ready." : "Check your inbox! Your resource is on its way."}
                showName={true}
                variant="compact"
                onSuccess={() => setShowForm(false)}
              />
              <button
                onClick={() => setShowForm(false)}
                className="w-full py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded"
                aria-label="Cancel and close form"
                type="button"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

// Memoize to prevent unnecessary re-renders when parent updates
const MemoizedResourceCard = memo(ResourceCard);
MemoizedResourceCard.displayName = 'ResourceCard';
export default MemoizedResourceCard;
