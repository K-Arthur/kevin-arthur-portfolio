'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaRedo, FaShare, FaTwitter, FaLinkedin } from '@/lib/icons';
import ConfettiCelebration from './ConfettiCelebration';
import AchievementBadge, { ACHIEVEMENTS, AchievementBadgeCompact } from './AchievementBadge';
import { trackQuizEvent } from '@/lib/analytics-store';

const QUIZ_STORAGE_KEY = 'ai-readiness-quiz-progress';
const BENCHMARK_STORAGE_KEY = 'ai-readiness-quiz-benchmarks';
const ACHIEVEMENTS_STORAGE_KEY = 'ai-readiness-quiz-achievements';
const QUIZ_START_TIME_KEY = 'ai-readiness-quiz-start-time';

// Question difficulty levels for scoring
const questionDifficulty = {
  1: 'easy',
  2: 'easy',
  3: 'medium',
  4: 'medium',
  5: 'hard',
  6: 'hard',
  7: 'hard',
};

// Points per difficulty level
const difficultyPoints = {
  easy: 10,
  medium: 15,
  hard: 20,
};

const questions = [
  {
    id: 1,
    question: "How does your product currently communicate uncertainty or varying confidence levels to users?",
    options: [
      { text: "We don't show confidence levels", score: 0 },
      { text: "We show a simple confidence percentage", score: 1 },
      { text: "We have tiered confidence states with appropriate actions (high/medium/low)", score: 2 },
    ],
  },
  {
    id: 2,
    question: "How long do your users wait for results, and how is this communicated?",
    options: [
      { text: "Standard spinner with no context", score: 0 },
      { text: "Progress indicator with generic messaging", score: 1 },
      { text: "Contextual loading states that explain what's happening", score: 2 },
    ],
  },
  {
    id: 3,
    question: "When AI predictions fail or return unexpected results, what happens?",
    options: [
      { text: "Generic error message, user must restart", score: 0 },
      { text: "Error with retry option", score: 1 },
      { text: "Graceful degradation with fallback options and clear next steps", score: 2 },
    ],
  },
  {
    id: 4,
    question: "Can users correct or override AI-generated outputs?",
    options: [
      { text: "AI output is final, no editing", score: 0 },
      { text: "Users can edit output but changes aren't learned", score: 1 },
      { text: "Clear correction flow with feedback mechanism", score: 2 },
    ],
  },
  {
    id: 5,
    question: "Can users understand WHY the AI made a specific recommendation?",
    options: [
      { text: "Black box—output only, no explanation", score: 0 },
      { text: "Basic reasoning shown (e.g., \"based on your history\")", score: 1 },
      { text: "Detailed explanation with supporting evidence users can verify", score: 2 },
    ],
  },
  {
    id: 6,
    question: "How does your interface handle unusual or out-of-distribution inputs?",
    options: [
      { text: "AI processes everything the same way", score: 0 },
      { text: "Some input validation exists", score: 1 },
      { text: "Clear boundaries communicated; graceful handling of edge cases", score: 2 },
    ],
  },
  {
    id: 7,
    question: "Do users understand the appropriate level of trust for AI outputs?",
    options: [
      { text: "No guidance on when to trust AI", score: 0 },
      { text: "General disclaimer about AI limitations", score: 1 },
      { text: "Context-specific trust guidance based on confidence and stakes", score: 2 },
    ],
  },
];

const getResults = (score) => {
  if (score >= 12) {
    return {
      tier: 'ready',
      title: 'AI-Ready',
      icon: FaCheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      summary: "Your UX foundation is solid for AI integration.",
      nextStep: "Fine-tune confidence communication and add AI-specific design system components.",
    };
  } else if (score >= 7) {
    return {
      tier: 'needs-work',
      title: 'Needs Work',
      icon: FaExclamationTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      summary: "Foundational pieces exist, but gaps could undermine user trust.",
      nextStep: "Address gaps before AI development. Consider a UX audit.",
      priorities: [
        "Implement tiered confidence states",
        "Design human override patterns",
        "Create AI-specific loading states",
      ],
    };
  } else {
    return {
      tier: 'start-fresh',
      title: 'Start Fresh',
      icon: FaTimesCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      summary: "Current UX patterns aren't designed for AI's uncertainty.",
      nextStep: "Dedicated AI interface design phase before development.",
      warnings: [
        "Users won't know when to trust AI",
        "Errors will feel like system failures",
      ],
    };
  }
};

// Benchmarking functions
const getBenchmarkData = () => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(BENCHMARK_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading benchmark data:', error);
  }

  // Return default benchmark data if none exists
  return {
    totalParticipants: 247,
    averageScore: 8.5,
    scores: [4, 5, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14],
    categoryAverages: {
      confidence: 1.2,
      loading: 1.1,
      errorHandling: 1.0,
      correction: 1.3,
      explanation: 1.1,
      edgeCases: 1.0,
      trust: 1.1,
    },
  };
};

const saveBenchmarkScore = (score) => {
  if (typeof window === 'undefined') return;

  try {
    const benchmarks = getBenchmarkData() || {
      totalParticipants: 0,
      averageScore: 0,
      scores: [],
      categoryAverages: {
        confidence: 1.2,
        loading: 1.1,
        errorHandling: 1.0,
        correction: 1.3,
        explanation: 1.1,
        edgeCases: 1.0,
        trust: 1.1,
      },
    };

    benchmarks.scores.push(score);
    benchmarks.totalParticipants += 1;
    benchmarks.averageScore = benchmarks.scores.reduce((a, b) => a + b, 0) / benchmarks.scores.length;

    localStorage.setItem(BENCHMARK_STORAGE_KEY, JSON.stringify(benchmarks));
  } catch (error) {
    console.error('Error saving benchmark score:', error);
  }
};

const calculatePercentile = (score, benchmarks) => {
  if (!benchmarks || !benchmarks.scores || benchmarks.scores.length === 0) return 50;

  const scoresBelow = benchmarks.scores.filter(s => s < score).length;
  const scoresEqual = benchmarks.scores.filter(s => s === score).length;

  return Math.round(((scoresBelow + scoresEqual / 2) / benchmarks.scores.length) * 100);
};

const getPercentileRank = (percentile) => {
  if (percentile >= 90) return { label: 'Top 10%', color: 'text-purple-500', bgColor: 'bg-purple-500/10' };
  if (percentile >= 75) return { label: 'Top 25%', color: 'text-blue-500', bgColor: 'bg-blue-500/10' };
  if (percentile >= 50) return { label: 'Above Average', color: 'text-green-500', bgColor: 'bg-green-500/10' };
  if (percentile >= 25) return { label: 'Average', color: 'text-amber-500', bgColor: 'bg-amber-500/10' };
  return { label: 'Below Average', color: 'text-red-500', bgColor: 'bg-red-500/10' };
};

const getTopPerformerInsights = (score, answers) => {
  const insights = [];

  // Analyze answers to provide insights
  if (answers[0] === 2) {
    insights.push("Top performers use tiered confidence states instead of simple percentages");
  }
  if (answers[1] === 2) {
    insights.push("Top performers explain what's happening during loading states");
  }
  if (answers[2] === 2) {
    insights.push("Top performers design graceful degradation with clear next steps");
  }
  if (answers[3] === 2) {
    insights.push("Top performers implement clear correction flows with feedback mechanisms");
  }
  if (answers[4] === 2) {
    insights.push("Top performers provide detailed explanations with verifiable evidence");
  }

  if (insights.length === 0) {
    insights.push("Top performers consistently score 2 points on all questions");
  }

  return insights;
};

export default function AIReadinessQuiz({ className = '', compact = false, noBackground = false }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);
  const [activeResultsTab, setActiveResultsTab] = useState('insights');
  const quizRef = useRef(null); // Added quizRef

  // Scroll to top when results are shown
  useEffect(() => {
    if (showResults && quizRef.current) {
      setTimeout(() => {
        const yOffset = -100; // Adjust for sticky nav
        const y = quizRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    }
  }, [showResults]);

  // Gamification state
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  const maxScore = questions.length * 2;
  const results = getResults(totalScore);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Load saved progress and achievements on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProgress = localStorage.getItem(QUIZ_STORAGE_KEY);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          if (parsed.answers && Object.keys(parsed.answers).length > 0) {
            setAnswers(parsed.answers);
            setCurrentQuestion(parsed.currentQuestion || 0);
            setHasSavedProgress(true);
            setShowContinuePrompt(true);
          }
        }
      } catch (error) {
        console.error('Error loading quiz progress:', error);
      }

      // Load achievements
      try {
        const savedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        if (savedAchievements) {
          setUnlockedAchievements(JSON.parse(savedAchievements));
        }
      } catch (error) {
        console.error('Error loading achievements:', error);
      }

      // Load benchmark data
      setBenchmarkData(getBenchmarkData());
    }
  }, []);

  // Save progress after each answer and track quiz start
  useEffect(() => {
    if (Object.keys(answers).length > 0 && !showResults) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            QUIZ_STORAGE_KEY,
            JSON.stringify({
              answers,
              currentQuestion,
              timestamp: Date.now(),
            })
          );
        } catch (error) {
          console.error('Error saving quiz progress:', error);
        }
      }

      // Track quiz start for lead scoring (only once)
      if (!hasTrackedStart) {
        setQuizStartTime(Date.now());
        addLeadScorePoints('START_QUIZ', {
          questionCount: Object.keys(answers).length,
        });
        trackQuizEvent('start');
        setHasTrackedStart(true);
      }
    }
  }, [answers, currentQuestion, showResults, hasTrackedStart]);

  const handleAnswer = (score) => {
    const newAnswers = { ...answers, [currentQuestion]: score };
    setAnswers(newAnswers);

    // Add a slight delay before auto-advancing
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        // Focus management for accessibility
        setTimeout(() => {
          const firstOption = document.querySelector(`[data-question="${currentQuestion + 1}"]`);
          firstOption?.focus();
        }, 100);
      } else {
        // Calculate final score and save to benchmarks
        const finalScore = Object.values(newAnswers).reduce((sum, s) => sum + s, 0);
        saveBenchmarkScore(finalScore);

        // Track quiz completion for lead scoring and analytics
        addLeadScorePoints('COMPLETE_QUIZ', {
          score: finalScore,
          maxScore: questions.length * 2,
        });
        trackQuizEvent('complete', finalScore);

        // Calculate quiz duration
        const quizDuration = quizStartTime ? (Date.now() - quizStartTime) / 1000 : 0;

        // Calculate and award points
        const points = calculateQuizPoints(newAnswers);
        setTotalPoints(points);

        // Unlock achievements
        const newAchievements = unlockAchievements(finalScore, quizDuration, maxStreak);
        setUnlockedAchievements(newAchievements);

        // Save achievements
        if (typeof window !== 'undefined') {
          localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(newAchievements));
        }

        // Trigger celebration
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);

        setShowResults(true);
        // Clear saved progress when quiz is completed
        if (typeof window !== 'undefined') {
          localStorage.removeItem(QUIZ_STORAGE_KEY);
        }
      }
    }, 150); // Changed from 300 to 150
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);

    setHasSavedProgress(false);
    setShowContinuePrompt(false);
    // Clear saved progress
    if (typeof window !== 'undefined') {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
    }
  };

  const handleContinueQuiz = () => {
    setShowContinuePrompt(false);
  };

  const handleStartFresh = () => {
    // Reset gamification state
    setTotalPoints(0);
    setStreak(0);
    setMaxStreak(0);
    setShowCelebration(false);
    resetQuiz();
  };

  const calculateQuizPoints = (quizAnswers) => {
    let points = 0;
    Object.entries(quizAnswers).forEach(([questionId, score]) => {
      const qIndex = parseInt(questionId) + 1;
      const difficulty = questionDifficulty[qIndex] || 'medium';
      const pointsPerQuestion = difficultyPoints[difficulty] || 10;

      // Award points based on score (0 = 0 points, 1 = 50% of points, 2 = 100% of points)
      points += (score / 2) * pointsPerQuestion;
    });
    return Math.round(points);
  };

  const unlockAchievements = (score, duration, maxStreakCount) => {
    const achievements = [...unlockedAchievements];

    // First Steps - complete the quiz
    if (!achievements.includes('first-steps')) {
      achievements.push('first-steps');
    }

    // Perfect Score - score 14/14
    if (score === 14 && !achievements.includes('perfect-score')) {
      achievements.push('perfect-score');
    }

    // AI Pioneer - score 12+
    if (score >= 12 && !achievements.includes('ai-pioneer')) {
      achievements.push('ai-pioneer');
    }

    // Quick Thinker - complete in under 2 minutes
    if (duration > 0 && duration < 120 && !achievements.includes('quick-thinker')) {
      achievements.push('quick-thinker');
    }

    // Streak Master - 5+ consecutive correct answers
    if (maxStreakCount >= 5 && !achievements.includes('streak-master')) {
      achievements.push('streak-master');
    }

    return achievements;
  };

  const handleShare = (platform) => {
    const shareText = `I scored ${totalScore}/${questions.length * 2} on the AI Interface Readiness Audit! How ready is your product's UX for AI features?`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    let shareLink = '';

    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareLink, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const ResultIcon = results.icon;

  const completedQuestions = Object.keys(answers).length;

  return (
    <div ref={quizRef} className={`${noBackground ? '' : 'glass-premium p-4 sm:p-6 md:p-8'} ${className}`}>
      <AnimatePresence mode="wait">
        {/* Continue Quiz Prompt */}
        {showContinuePrompt && !showResults && (
          <motion.div
            key="continue-prompt"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 sm:mb-6 bg-primary/10 border border-primary/30 rounded-xl p-3 sm:p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaRedo className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                  Continue your quiz ({completedQuestions}/{questions.length} complete)
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  You have saved progress. Would you like to continue where you left off?
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleContinueQuiz}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors min-h-[44px]"
                  >
                    <span>Continue</span>
                    <FaArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleStartFresh}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors min-h-[44px]"
                  >
                    <FaRedo className="w-3 h-3" />
                    <span>Start Fresh</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {!showResults ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Progress Bar */}
            <div className="mb-4 sm:mb-8">
              <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div
                className="h-2 bg-muted/30 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Quiz progress: ${Math.round(progress)}% complete`}
              >
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question */}
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 id={`question-${currentQuestion}-title`} className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-4 sm:mb-5">
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-2.5 sm:space-y-3" role="radiogroup" aria-labelledby={`question-${currentQuestion}-title`}>
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === option.score;
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(option.score)}
                      data-question={currentQuestion}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      className={`w-full text-left py-4 sm:py-5 px-5 sm:px-6 rounded-xl border transition-all flex items-center bg-card/30 focus:outline-none focus:ring-2 focus:ring-primary/40 ${isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-primary/50 hover:bg-card/50'
                        }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="text-foreground text-sm sm:text-base leading-relaxed">{option.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Navigation */}
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="mt-4 sm:mt-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
                aria-label="Go to previous question"
              >
                <FaArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm sm:text-base">Previous question</span>
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[640px] mx-auto"
          >
            {/* Confetti Celebration */}
            <ConfettiCelebration trigger={showCelebration} intensity="high" />

            {/* Compact Score Header - Horizontal Layout */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 flex-wrap">
              {/* Score Circle */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${results.bgColor} rounded-xl flex items-center justify-center`}>
                  <ResultIcon className={`w-6 h-6 sm:w-7 sm:h-7 ${results.color}`} />
                </div>
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    {totalScore}<span className="text-base text-muted-foreground">/{maxScore}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{totalPoints} pts</div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-10 bg-border/50" />

              {/* Percentile */}
              {benchmarkData && (
                <div className="text-left">
                  <div className={`text-lg font-semibold ${getPercentileRank(calculatePercentile(totalScore, benchmarkData)).color}`}>
                    Top {100 - calculatePercentile(totalScore, benchmarkData)}%
                  </div>
                  <div className="text-xs text-muted-foreground">percentile</div>
                </div>
              )}
            </div>

            {/* Status Title */}
            <div className="text-center mb-3">
              <h3 className={`text-lg sm:text-xl font-bold ${results.color}`}>
                {results.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{results.summary}</p>
            </div>

            {/* Tabbed Content */}
            <div className="mb-4">
              {/* Tab Headers */}
              <div className="flex gap-1 p-1 bg-muted/30 rounded-lg mb-3">
                {[
                  { id: 'insights', label: 'Insights' },
                  { id: 'compare', label: 'Compare' },
                  { id: 'actions', label: 'Actions' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveResultsTab(tab.id)}
                    className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                      activeResultsTab === tab.id
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeResultsTab === 'insights' && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {getTopPerformerInsights(totalScore, answers).length > 0 ? (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-left">
                        <p className="font-medium text-foreground text-xs mb-2">Top performers do this:</p>
                        <ul className="space-y-1">
                          {getTopPerformerInsights(totalScore, answers).slice(0, 2).map((insight, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-muted/30 rounded-xl p-3 text-center text-sm text-muted-foreground">
                        Score higher to unlock insights
                      </div>
                    )}
                  </motion.div>
                )}

                {activeResultsTab === 'compare' && benchmarkData && (
                  <motion.div
                    key="compare"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3"
                  >
                    {/* Compact Comparison Bar */}
                    <div className="bg-muted/30 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Your Score</span>
                        <span>Industry Avg</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full">
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 z-10"
                          style={{ left: `${(benchmarkData.averageScore / maxScore) * 100}%` }}
                        />
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(totalScore / maxScore) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1.5">
                        <span className="font-medium text-foreground">{totalScore}</span>
                        <span className="text-muted-foreground">{benchmarkData.averageScore.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                        <div className="text-lg font-bold text-foreground">{benchmarkData.totalParticipants}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">Participants</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                        <div className="text-lg font-bold text-foreground">{benchmarkData.averageScore.toFixed(1)}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">Avg Score</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeResultsTab === 'actions' && (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* Priorities or Warnings */}
                    {results.priorities && results.priorities.length > 0 && (
                      <div className={`${results.bgColor} ${results.borderColor} border rounded-xl p-3 text-left mb-2`}>
                        <p className="font-medium text-foreground text-xs mb-1.5">Priority Fixes:</p>
                        <ul className="space-y-1">
                          {results.priorities.map((item, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className={results.color}>•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {results.warnings && results.warnings.length > 0 && (
                      <div className={`${results.bgColor} ${results.borderColor} border rounded-xl p-3 text-left mb-2`}>
                        <p className="font-medium text-foreground text-xs mb-1.5">What This Means:</p>
                        <ul className="space-y-1">
                          {results.warnings.map((item, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className={results.color}>•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="bg-card/50 rounded-lg p-2.5 text-left">
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Next:</strong> {results.nextStep}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Achievements - Compact Inline */}
            {unlockedAchievements.length > 0 && (
              <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                {unlockedAchievements.map((achievementId) => (
                  <AchievementBadgeCompact
                    key={achievementId}
                    achievementId={achievementId}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons - Compact Row */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border/50 rounded-xl hover:border-primary/50 transition-colors text-foreground text-sm"
              >
                <FaShare className="w-3.5 h-3.5" />
                <span>Share Results</span>
              </button>
              <button
                onClick={resetQuiz}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                <FaRedo className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>


          </motion.div>
        )}



        {/* Share Modal */}
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card-enhanced p-6 rounded-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                Share Your Score
              </h3>

              <div className="bg-muted/50 rounded-xl p-4 mb-6 text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {totalScore}/{maxScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalPoints} points • {unlockedAchievements.length} achievements
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#1DA1F2] text-white rounded-xl hover:bg-[#1a8cd8] transition-colors font-medium"
                >
                  <FaTwitter className="w-5 h-5" />
                  <span>Share on Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#0A66C2] text-white rounded-xl hover:bg-[#0958a8] transition-colors font-medium"
                >
                  <FaLinkedin className="w-5 h-5" />
                  <span>Share on LinkedIn</span>
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border-2 border-border/50 rounded-xl hover:border-primary/50 transition-colors text-foreground"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
