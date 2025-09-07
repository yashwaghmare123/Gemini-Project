import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LightBulbIcon,
  SparklesIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';


import {
  generateFlashcards,
  flipCard,
  nextCard,
  previousCard,
  goToCard,
  markCardKnown,
  markCardUnknown,
  startStudySession,
  shuffleDeck
} from '../../store/slices/flashcardsSlice';

import { setCurrentPage, addNotification } from '../../store/slices/uiSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const FlashcardViewer = () => {
  const dispatch = useDispatch();
  const {
    currentDeck,
    currentCardIndex,
    isFlipped,
    studyStats,
    loading
  } = useSelector((state) => state.flashcards);

  const [showSetup, setShowSetup] = useState(!currentDeck);
  const [setupData, setSetupData] = useState({ topic: '' });
  const [studyMode, setStudyMode] = useState(false);

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    if (!setupData.topic.trim()) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Please enter a topic for the flashcards'
        })
      );
      return;
    }

    try {
      await dispatch(generateFlashcards(setupData)).unwrap();
      setShowSetup(false);
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error || 'Failed to generate flashcards'
        })
      );
    }
  };

  const handleNewFlashcards = () => {
    setShowSetup(true);
    setStudyMode(false);
  };

  const handleStartStudy = () => {
    dispatch(startStudySession());
    setStudyMode(true);
  };

  const handleKnown = () => {
    dispatch(markCardKnown());
    setTimeout(() => {
      if (currentCardIndex < currentDeck.cards.length - 1) {
        dispatch(nextCard());
      }
    }, 500);
  };

  const handleUnknown = () => {
    dispatch(markCardUnknown());
    setTimeout(() => {
      if (currentCardIndex < currentDeck.cards.length - 1) {
        dispatch(nextCard());
      }
    }, 500);
  };

  // Setup Screen
  if (showSetup) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-6">
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
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LightBulbIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Generate Flashcards
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create interactive flashcards for effective studying
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
                    onChange={(e) =>
                      setSetupData((prev) => ({ ...prev, topic: e.target.value }))
                    }
                    placeholder="e.g., Spanish Vocabulary, Chemistry Elements, Historical Dates"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !setupData.topic.trim()}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" className="mr-3" />
                      Generating Flashcards...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Generate Flashcards
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

  if (!currentDeck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const currentCard = currentDeck.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / currentDeck.cards.length) * 100;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => dispatch(setCurrentPage('dashboard'))}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>

            <div className="flex items-center space-x-4">
              {studyMode && (
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <ChartBarIcon className="h-4 w-4" />
                    <span>{studyStats.cardsStudied} studied</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span>{studyStats.correctAnswers} known</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => dispatch(shuffleDeck())}
                className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowsRightLeftIcon className="h-4 w-4 mr-1" />
                Shuffle
              </button>

              <button
                onClick={studyMode ? () => setStudyMode(false) : handleStartStudy}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                  studyMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {studyMode ? (
                  <>
                    <PauseIcon className="h-4 w-4 mr-1" />
                    Stop Study
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Study Mode
                  </>
                )}
              </button>

              <button
                onClick={handleNewFlashcards}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium"
              >
                New Cards
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>
                Card {currentCardIndex + 1} of {currentDeck.cards.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-yellow-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          {/* Main Deck Image */}
          {currentDeck.image && (
            <div className="mt-6 max-w-2xl mx-auto text-center">
              <img 
                src={`http://localhost:3001/api/images/${currentDeck.image.split('/').pop()}`}
                alt={`Illustration for ${currentDeck.title || 'flashcards'}`}
                className="max-w-sm mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  console.log('Deck image failed to load:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Flashcard */}
        <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCardIndex}
                initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -180 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div
                  className={`w-full h-80 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={() => dispatch(flipCard())}
                >
                  {/* Front of card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl flex items-center justify-center p-8">
                    <div className="text-center">
                      {currentCard.image ? (
                        <div className="mb-4">
                          <img 
                            src={`http://localhost:3001/api/images/${currentCard.image.split('/').pop()}`}
                            alt={`Illustration for ${currentCard.front}`}
                            className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                            onError={(e) => {
                              console.log('Card image failed to load:', e.target.src);
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <LightBulbIcon className="h-12 w-12 text-white mx-auto mb-4" />
                      )}
                      <h2 className="text-2xl font-bold text-white mb-4">
                        {currentCard.front}
                      </h2>
                      <p className="text-yellow-100 text-sm">Click to reveal answer</p>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center p-8">
                    <div className="text-center">
                      <CheckIcon className="h-12 w-12 text-white mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-white mb-4">
                        {currentCard.back}
                      </h2>
                      {currentCard.difficulty && (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            currentCard.difficulty === 'easy'
                              ? 'bg-green-500 text-white'
                              : currentCard.difficulty === 'medium'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {currentCard.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => dispatch(previousCard())}
                disabled={currentCardIndex === 0}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Previous
              </button>

              {/* Study Mode Controls */}
              {studyMode && isFlipped && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleUnknown}
                    className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 mr-1" />
                    Don't Know
                  </button>
                  <button
                    onClick={handleKnown}
                    className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <CheckIcon className="h-5 w-5 mr-1" />
                    Know It
                  </button>
                </div>
              )}

              <button
                onClick={() => dispatch(nextCard())}
                disabled={currentCardIndex === currentDeck.cards.length - 1}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRightIcon className="h-5 w-5 ml-1" />
              </button>
            </div>

            {/* Card Navigation Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {currentDeck.cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => dispatch(goToCard(index))}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentCardIndex
                      ? 'bg-yellow-600'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
};

export default FlashcardViewer;
