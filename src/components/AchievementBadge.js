'use client';

import { motion } from 'framer-motion';
import { FaTrophy, FaBolt, FaStar, FaCheckDouble, FaFire } from 'react-icons/fa';

/**
 * AchievementBadge Component
 * 
 * Displays achievement badges for gamification
 * Supports different badge types with icons and colors
 */

const ACHIEVEMENTS = {
  AI_PIONEER: {
    id: 'ai-pioneer',
    name: 'AI Pioneer',
    description: 'Completed the AI Readiness Quiz with a high score',
    icon: FaTrophy,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    requirement: 'Score 12+ on the quiz',
  },
  QUICK_THINKER: {
    id: 'quick-thinker',
    name: 'Quick Thinker',
    description: 'Completed the quiz in under 2 minutes',
    icon: FaBolt,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    requirement: 'Complete quiz in < 2 minutes',
  },
  PERFECT_SCORE: {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Achieved a perfect score on the quiz',
    icon: FaCheckDouble,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    requirement: 'Score 14/14 on the quiz',
  },
  STREAK_MASTER: {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Got 5+ answers correct in a row',
    icon: FaFire,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    requirement: '5+ consecutive correct answers',
  },
  FIRST_STEPS: {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Started your AI readiness journey',
    icon: FaStar,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    requirement: 'Complete the quiz',
  },
};

export default function AchievementBadge({ 
  achievementId, 
  unlocked = false, 
  showDescription = true,
  size = 'md',
  className = '' 
}) {
  const achievement = ACHIEVEMENTS[achievementId];
  
  if (!achievement) {
    console.warn(`Unknown achievement ID: ${achievementId}`);
    return null;
  }

  const Icon = achievement.icon;

  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
    >
      <div
        className={`
          ${achievement.bgColor} ${achievement.borderColor} border-2 rounded-2xl p-6
          ${unlocked ? 'opacity-100' : 'opacity-50 grayscale'}
          transition-all duration-300 hover:scale-105
        `}
      >
        {/* Badge Icon */}
        <div
          className={`
            ${sizeClasses[size]} ${achievement.color} rounded-full flex items-center justify-center
            mx-auto mb-4
          `}
        >
          <Icon />
        </div>

        {/* Badge Name */}
        <h4 className="text-center font-bold text-foreground mb-2">
          {achievement.name}
        </h4>

        {/* Description */}
        {showDescription && (
          <p className="text-center text-sm text-muted-foreground mb-3">
            {achievement.description}
          </p>
        )}

        {/* Requirement */}
        {!unlocked && (
          <p className="text-center text-xs text-muted-foreground">
            {achievement.requirement}
          </p>
        )}

        {/* Unlocked Badge */}
        {unlocked && (
          <div className="absolute -top-2 -right-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
              className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <FaCheckDouble className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * AchievementBadgeList Component
 * 
 * Displays a list of achievement badges
 */
export function AchievementBadgeList({ achievements, className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Object.values(ACHIEVEMENTS).map((achievement) => {
        const isUnlocked = achievements?.includes(achievement.id);
        return (
          <AchievementBadge
            key={achievement.id}
            achievementId={achievement.id}
            unlocked={isUnlocked}
            showDescription={true}
            size="md"
          />
        );
      })}
    </div>
  );
}

/**
 * AchievementBadgeCompact Component
 * 
 * Compact version for displaying unlocked achievements
 */
export function AchievementBadgeCompact({ achievementId, className = '' }) {
  const achievement = ACHIEVEMENTS[achievementId];
  
  if (!achievement) return null;

  const Icon = achievement.icon;

  return (
    <div
      className={`
        ${achievement.bgColor} ${achievement.borderColor} border rounded-lg px-3 py-2
        inline-flex items-center gap-2
      `}
      title={achievement.name}
    >
      <Icon className={`w-4 h-4 ${achievement.color}`} />
      <span className="text-sm font-medium text-foreground">{achievement.name}</span>
    </div>
  );
}

/**
 * AchievementProgress Component
 * 
 * Shows progress towards unlocking an achievement
 */
export function AchievementProgress({ 
  achievementId, 
  progress, 
  max = 100,
  className = '' 
}) {
  const achievement = ACHIEVEMENTS[achievementId];
  
  if (!achievement) return null;

  const percentage = Math.min((progress / max) * 100, 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{achievement.name}</span>
        <span className="text-xs text-muted-foreground">{progress}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${achievement.color.replace('text-', 'bg-')} rounded-full`}
        />
      </div>
    </div>
  );
}

export { ACHIEVEMENTS };
