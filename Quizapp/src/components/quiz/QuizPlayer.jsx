import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { generateQuiz, setAnswer, submitQuizAnswers, clearQuiz } from '../../store/slices/quizSlice';
import { setCurrentPage, addNotification } from '../../store/slices/uiSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const QuizPlayer = () => {
  const dispatch = useDispatch();
  const { currentQuiz, currentAnswers, quizResult, loading, isSubmitted } = useSelector(state => state.quiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSetup, setShowSetup] = useState(!currentQuiz);
  const [setupData, setSetupData] = useState({ topic: '', numQuestions: 5 });
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let timer;
    if (currentQuiz && !isSubmitted) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentQuiz, isSubmitted]);

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    if (!setupData.topic.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a topic for the quiz'
      }));
      return;
    }

    try {
      await dispatch(generateQuiz(setupData)).unwrap();
      setShowSetup(false);
      setTimeElapsed(0);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to generate quiz'
      }));
    }
  };

  const handleAnswerSelect = (answer) => {
    dispatch(setAnswer({ questionIndex: currentQuestionIndex, answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const answersArray = Array(currentQuiz.questions.length).fill(null);
    Object.keys(currentAnswers).forEach(key => {
      answersArray[parseInt(key)] = currentAnswers[key];
    });

    try {
      await dispatch(submitQuizAnswers({ 
        answers: answersArray, 
        quiz: currentQuiz 
      })).unwrap();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to submit quiz'
      }));
    }
  };

  const handleNewQuiz = () => {
    dispatch(clearQuiz());
    setShowSetup(true);
    setCurrentQuestionIndex(0);
    setTimeElapsed(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = currentQuiz ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100 : 0;
  const answeredCount = Object.keys(currentAnswers).length;

  // Setup Screen
  if (showSetup) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => dispatch(setCurrentPage('dashboard'))}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Create a Quiz
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter a topic and let AI generate a quiz for you
                </p>
              </div>

              <form onSubmit={handleSetupSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={setupData.topic}
                    onChange={(e) => setSetupData(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="e.g., World War II, Photosynthesis, JavaScript"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Questions
                  </label>
                  <select
                    value={setupData.numQuestions}
                    onChange={(e) => setSetupData(prev => ({ ...prev, numQuestions: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {[3, 5, 10, 15, 20].map(num => (
                      <option key={num} value={num}>{num} questions</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !setupData.topic.trim()}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" className="mr-3" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Results Screen
  if (isSubmitted && quizResult) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Quiz Complete!
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Your score: {quizResult.score}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
                </p>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {quizResult.score}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Final Score</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {quizResult.correctAnswers}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {formatTime(timeElapsed)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time Taken</p>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Question Review
                </h3>
                {quizResult.results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.isCorrect
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900'
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {result.isCorrect ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          {result.question}
                        </p>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="font-medium">Your answer:</span>{' '}
                            <span className={result.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {result.userAnswer || 'No answer'}
                            </span>
                          </p>
                          {!result.isCorrect && (
                            <p>
                              <span className="font-medium">Correct answer:</span>{' '}
                              <span className="text-green-600 dark:text-green-400">
                                {result.correctAnswer}
                              </span>
                            </p>
                          )}
                          {result.explanation && (
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                              <span className="font-medium">Explanation:</span> {result.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleNewQuiz}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Take Another Quiz
                </button>
                <button
                  onClick={() => dispatch(setCurrentPage('dashboard'))}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Quiz Screen
  if (!currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => dispatch(setCurrentPage('dashboard'))}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Exit Quiz
            </button>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 max-w-4xl mx-auto">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = currentAnswers[currentQuestionIndex] === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                        <span className="text-gray-900 dark:text-white">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {answeredCount} of {currentQuiz.questions.length} answered
                </div>

                {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={answeredCount < currentQuiz.questions.length}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Next
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default QuizPlayer;
