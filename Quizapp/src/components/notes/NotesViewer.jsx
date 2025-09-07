import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { generateNotes, toggleSection, expandAllSections, collapseAllSections } from '../../store/slices/notesSlice';
import { setCurrentPage, addNotification } from '../../store/slices/uiSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const NotesViewer = () => {
  const dispatch = useDispatch();
  const { currentNotes, expandedSections, loading } = useSelector(state => state.notes);
  const [showSetup, setShowSetup] = useState(!currentNotes);
  const [setupData, setSetupData] = useState({ topic: '', gradeLevel: 'Elementary' });

  const gradeLevels = ['Elementary', 'Middle School', 'High School', 'College', 'Graduate'];

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    if (!setupData.topic.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a topic for the notes'
      }));
      return;
    }

    try {
      await dispatch(generateNotes(setupData)).unwrap();
      setShowSetup(false);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to generate notes'
      }));
    }
  };

  const handleNewNotes = () => {
    setShowSetup(true);
  };

  // Setup Screen
  if (showSetup) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
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
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Generate Study Notes
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create comprehensive study materials for any topic
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
                    placeholder="e.g., Photosynthesis, Renaissance Art, Machine Learning"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grade Level
                  </label>
                  <select
                    value={setupData.gradeLevel}
                    onChange={(e) => setSetupData(prev => ({ ...prev, gradeLevel: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {gradeLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !setupData.topic.trim()}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" className="mr-3" />
                      Generating Notes...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Generate Notes
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

  if (!currentNotes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
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
              <button
                onClick={() => dispatch(expandAllSections())}
                className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Expand All
              </button>
              <button
                onClick={() => dispatch(collapseAllSections())}
                className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <EyeSlashIcon className="h-4 w-4 mr-1" />
                Collapse All
              </button>
              <button
                onClick={handleNewNotes}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
              >
                New Notes
              </button>
            </div>
          </div>
        </div>

        {/* Notes Content */}
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{currentNotes.title}</h1>
              <p className="text-green-100">Grade Level: {currentNotes.gradeLevel}</p>
              
              {/* Generated Image */}
              {currentNotes.image && (
                <div className="mt-4">
                  <p className="text-yellow-100 text-sm mb-2">Debug: Image path = {currentNotes.image}</p>
                  <img 
                    src={`http://localhost:3001/api/images/${currentNotes.image.split('/').pop()}`}
                    alt={`Illustration for ${currentNotes.title}`}
                    className="max-w-md mx-auto rounded-lg shadow-lg"
                    onLoad={(e) => {
                      console.log('✅ Image loaded successfully:', e.target.src);
                    }}
                    onError={(e) => {
                      console.log('❌ Image failed to load:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              {!currentNotes.image && (
                <p className="text-yellow-100 text-sm mt-4">Debug: No image found in currentNotes</p>
              )}
            </div>

            {/* Sections */}
            <div className="p-6">
              <div className="space-y-4">
                {currentNotes.sections?.map((section, index) => {
                  const isExpanded = expandedSections.includes(index);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => dispatch(toggleSection(index))}
                        className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-between"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {section.heading}
                        </h3>
                        {isExpanded ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-white dark:bg-gray-800">
                          <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                              {section.content}
                            </p>
                            
                            {section.keyPoints && section.keyPoints.length > 0 && (
                              <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                  Key Points:
                                </h4>
                                <ul className="space-y-2">
                                  {section.keyPoints.map((point, pointIndex) => (
                                    <li
                                      key={pointIndex}
                                      className="flex items-start space-x-2"
                                    >
                                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-gray-700 dark:text-gray-300">
                                        {point}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary */}
              {currentNotes.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Summary
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {currentNotes.summary}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NotesViewer;
