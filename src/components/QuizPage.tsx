import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '../types';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  RefreshCw, 
  BookOpen, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface QuizPageProps {
  savedQuizzes: Quiz[];
  setSavedQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}

export const QuizPage: React.FC<QuizPageProps> = ({
  savedQuizzes,
  setSavedQuizzes,
}) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [loading, setLoading] = useState(false);

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(savedQuizzes[0] || null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const popularTopics = [
    'Data Structures & Hash Tables',
    'Cellular Respiration & Genetics',
    'Principles of Microeconomics',
    'Linear Algebra & Matrices',
    'Constitutional Law Basics',
    'Machine Learning Fundamentals',
  ];

  const handleGenerateQuiz = async (customTopic?: string) => {
    const targetTopic = customTopic || topic.trim();
    if (!targetTopic) return;

    setLoading(true);
    setSubmitted(false);
    setUserAnswers({});
    setCurrentQuestionIdx(0);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: targetTopic, difficulty }),
      });

      const newQuiz: Quiz = await res.json();
      setActiveQuiz(newQuiz);
      setSavedQuizzes((prev) => [newQuiz, ...prev]);
    } catch (err) {
      console.error('Quiz Generator Error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    setSubmitted(true);
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let correct = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleRetake = () => {
    setSubmitted(false);
    setUserAnswers({});
    setCurrentQuestionIdx(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-blue-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Quiz Generator
          </h1>
          <span className="text-xs bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-semibold px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-600" /> 5 MCQs + Explanations
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
          Generate five multiple choice questions for any university topic to test active recall before exams.
        </p>
      </div>

      {/* Generator Bar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateQuiz();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative w-full flex-grow">
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (e.g. 'Photosynthesis', 'Sorting Algorithms', 'Macroeconomics')..."
              className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="quiz-topic-input"
            />
          </div>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="quiz-difficulty-select"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard / Advanced</option>
          </select>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 whitespace-nowrap"
            id="quiz-generate-btn"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <HelpCircle className="w-4 h-4" />
                <span>Generate 5 MCQs</span>
              </>
            )}
          </button>
        </form>

        {/* Popular Topics Pill Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Quick Topics:</span>
          {popularTopics.map((pt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopic(pt);
                handleGenerateQuiz(pt);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-700/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-medium transition-colors"
              id={`popular-topic-btn-${idx}`}
            >
              {pt}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Display Section */}
      {activeQuiz ? (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-6">
          {/* Quiz Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                  Topic: {activeQuiz.topic}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Difficulty: {activeQuiz.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                5 Multiple Choice Questions
              </h2>
            </div>

            {/* Question Progress Dots */}
            <div className="flex items-center space-x-1.5">
              {activeQuiz.questions.map((_, idx) => {
                const isCurrent = idx === currentQuestionIdx;
                const isAnswered = userAnswers[idx] !== undefined;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-xs scale-105'
                        : isAnswered
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                    id={`quiz-dot-${idx}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Question View */}
          {activeQuiz.questions[currentQuestionIdx] && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Question {currentQuestionIdx + 1} of 5
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {activeQuiz.questions[currentQuestionIdx].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {activeQuiz.questions[currentQuestionIdx].options.map((optionText, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                  const isCorrect = activeQuiz.questions[currentQuestionIdx].correctAnswerIndex === optIdx;

                  let optionStyle = 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-300';

                  if (isSelected) {
                    optionStyle = 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-900 dark:text-blue-200 font-semibold';
                  }

                  if (submitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200 font-semibold';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start justify-between space-x-3 ${optionStyle}`}
                      id={`quiz-option-${currentQuestionIdx}-${optIdx}`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optionText}</span>
                      </div>

                      {submitted && (
                        <div>
                          {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                          {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box after submission */}
              {submitted && (
                <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 space-y-1.5 animate-fade-in">
                  <div className="font-bold text-xs text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    AI Explanation for Question {currentQuestionIdx + 1}:
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeQuiz.questions[currentQuestionIdx].explanation}
                  </p>
                </div>
              )}

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>

                {!submitted ? (
                  currentQuestionIdx === 4 ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                      id="quiz-submit-btn"
                    >
                      <Award className="w-4 h-4" />
                      <span>Submit Quiz</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestionIdx((p) => Math.min(4, p + 1))}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleRetake}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Quiz</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Score Summary Box when submitted */}
          {submitted && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white space-y-3 text-center shadow-lg">
              <Award className="w-10 h-10 mx-auto text-amber-300" />
              <h3 className="text-2xl font-extrabold">
                Quiz Completed! Score: {calculateScore()} / 5 ({Math.round((calculateScore() / 5) * 100)}%)
              </h3>
              <p className="text-xs text-blue-100 max-w-md mx-auto">
                {calculateScore() >= 4
                  ? 'Excellent retention! You have a solid grasp of this topic.'
                  : 'Good effort! Review the explanations above to strengthen your weak spots before exam day.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Active Quiz Generated Yet
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Type any university subject above or click one of the quick topics to generate a 5-question multiple choice test.
          </p>
        </div>
      )}
    </div>
  );
};
