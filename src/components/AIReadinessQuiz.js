'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaBrain, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import LeadMagnetForm from './LeadMagnetForm';

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
      summary: "Your UX foundation is solid for AI integration. You've already built the trust, transparency, and error-handling patterns that AI interfaces require.",
      nextStep: "Focus on fine-tuning confidence communication and ensuring your team has AI-specific design system components.",
    };
  } else if (score >= 7) {
    return {
      tier: 'needs-work',
      title: 'Needs Work',
      icon: FaExclamationTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      summary: "You have some foundational pieces, but gaps exist that could undermine user trust or cause confusion when AI is introduced.",
      nextStep: "Address identified gaps before AI development begins. Consider a UX audit focused on AI readiness.",
      priorities: [
        "Implement tiered confidence states",
        "Design explicit human override patterns",
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
      summary: "Your current UX patterns aren't designed for AI's inherent uncertainty. Adding AI without UX changes will likely frustrate users and erode trust.",
      nextStep: "A dedicated AI interface design phase before development. This isn't a quick fix—it's foundational work.",
      warnings: [
        "Users won't know when to trust AI outputs",
        "Errors will feel like system failures",
        "You'll spend more time on support than development",
      ],
    };
  }
};

export default function AIReadinessQuiz({ className = '' }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  const maxScore = questions.length * 2;
  const results = getResults(totalScore);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (score) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: score }));
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
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
    setShowEmailCapture(false);
  };

  const ResultIcon = results.icon;

  return (
    <div className={`card-enhanced p-6 md:p-8 ${className}`}>
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
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
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.score)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      answers[currentQuestion] === option.score
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-primary/50 hover:bg-card/50'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="text-foreground">{option.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Navigation */}
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="mt-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Go to previous question"
              >
                <FaArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Previous question</span>
              </button>
            )}
          </motion.div>
        ) : !showEmailCapture ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            {/* Score Display */}
            <div className={`w-20 h-20 ${results.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <ResultIcon className={`w-10 h-10 ${results.color}`} />
            </div>

            <div className="mb-2">
              <span className="text-4xl font-bold text-foreground">{totalScore}</span>
              <span className="text-xl text-muted-foreground">/{maxScore}</span>
            </div>

            <h3 className={`text-2xl font-bold mb-4 ${results.color}`}>
              {results.title}
            </h3>

            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {results.summary}
            </p>

            {/* Tier-specific content */}
            {results.priorities && (
              <div className={`${results.bgColor} ${results.borderColor} border rounded-xl p-4 mb-6 text-left`}>
                <p className="font-medium text-foreground mb-2">Priority Fixes:</p>
                <ul className="space-y-1">
                  {results.priorities.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className={results.color}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.warnings && (
              <div className={`${results.bgColor} ${results.borderColor} border rounded-xl p-4 mb-6 text-left`}>
                <p className="font-medium text-foreground mb-2">What This Means:</p>
                <ul className="space-y-1">
                  {results.warnings.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className={results.color}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-card/50 rounded-xl p-4 mb-8">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Next Step:</strong> {results.nextStep}
              </p>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <button
                onClick={() => setShowEmailCapture(true)}
                className="group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-glow font-semibold px-8 py-4 rounded-xl transition-all w-full sm:w-auto"
              >
                <span>Get Your Detailed Report</span>
                <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-xs text-muted-foreground">
                Includes personalized recommendations for each question
              </p>
            </div>

            <button
              onClick={resetQuiz}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Retake the AI readiness audit"
            >
              Retake the audit
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="email-capture"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBrain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Get Your Detailed Report
              </h3>
              <p className="text-muted-foreground">
                We'll send you a personalized PDF with specific recommendations 
                based on your score of <strong className={results.color}>{totalScore}/{maxScore}</strong>
              </p>
            </div>

            <LeadMagnetForm
              resource="ai-audit"
              buttonText="Send My Report"
              successMessage="Check your inbox! Your personalized AI readiness report is on its way."
              showName={true}
            />

            <button
              onClick={() => setShowEmailCapture(false)}
              className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back to results"
            >
              ← Back to results
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
