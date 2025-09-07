import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  LightBulbIcon, 
  ClipboardDocumentListIcon,
  SparklesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { generateQuiz } from '../store/slices/quizSlice';
import { generateNotes } from '../store/slices/notesSlice';
import { generateFlashcards } from '../store/slices/flashcardsSlice';
import { generateAssignment } from '../store/slices/assignmentSlice';
import { addNotification } from '../store/slices/uiSlice';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorBoundary from './common/ErrorBoundary';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { loading: quizLoading } = useSelector(state => state.quiz);
  const { loading: notesLoading } = useSelector(state => state.notes);
  const { loading: flashcardsLoading } = useSelector(state => state.flashcards);
  const { loading: assignmentLoading } = useSelector(state => state.assignment);

  const [activeTab, setActiveTab] = useState('quiz');
  const [formData, setFormData] = useState({
    topic: '',
    numQuestions: 5,
    gradeLevel: 'Elementary',
    includeImages: false
  });

  const gradeLevels = [
    'Elementary', 'Middle School', 'High School', 'College', 'Graduate'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numQuestions' ? parseInt(value) : value
    }));
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a topic for the quiz'
      }));
      return;
    }

    try {
      await dispatch(generateQuiz({
        topic: formData.topic,
        numQuestions: formData.numQuestions,
        includeImages: formData.includeImages
      })).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        message: 'Quiz generated successfully!'
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to generate quiz'
      }));
    }
  };

  const handleGenerateNotes = async (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a topic for the notes'
      }));
      return;
    }

    try {
      await dispatch(generateNotes({
        topic: formData.topic,
        gradeLevel: formData.gradeLevel,
        includeImages: formData.includeImages
      })).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        message: 'Notes generated successfully!'
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to generate notes'
      }));
    }
  };

  const handleGenerateFlashcards = async (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a topic for the flashcards'
      }));
      return;
    }

    try {
      await dispatch(generateFlashcards({
        topic: formData.topic,
        includeImages: formData.includeImages
      })).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        message: 'Flashcards generated successfully!'
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to generate flashcards'
      }));
    }
  };

  const handleGenerateAssignment = async (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a topic for the assignment'
      }));
      return;
    }

    try {
      await dispatch(generateAssignment({
        topic: formData.topic,
        gradeLevel: formData.gradeLevel
      })).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        message: 'Assignment generated successfully!'
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to generate assignment'
      }));
    }
  };

  const tabs = [
    { id: 'quiz', name: 'Quiz', icon: AcademicCapIcon, color: 'bg-blue-500' },
    { id: 'notes', name: 'Notes', icon: DocumentTextIcon, color: 'bg-green-500' },
    { id: 'flashcards', name: 'Flashcards', icon: LightBulbIcon, color: 'bg-yellow-500' },
    { id: 'assignment', name: 'Assignment', icon: ClipboardDocumentListIcon, color: 'bg-purple-500' }
  ];

  const isLoading = quizLoading || notesLoading || flashcardsLoading || assignmentLoading;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Create educational content with AI assistance
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <div
                  key={tab.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center">
                    <div className={`${tab.color} rounded-lg p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {tab.name}
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {Math.floor(Math.random() * 50) + 10}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Common Form Fields */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      placeholder="Enter the topic (e.g., World War II, Photosynthesis, Algebra)"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  {(activeTab === 'notes' || activeTab === 'assignment') && (
                    <div>
                      <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Grade Level
                      </label>
                      <select
                        id="gradeLevel"
                        name="gradeLevel"
                        value={formData.gradeLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      >
                        {gradeLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Include Images Option */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="includeImages"
                      name="includeImages"
                      checked={formData.includeImages}
                      onChange={(e) => setFormData(prev => ({ ...prev, includeImages: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeImages" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <SparklesIcon className="h-4 w-4 text-purple-500" />
                        <span>Generate AI Images</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Add visual illustrations to enhance learning
                      </p>
                    </label>
                  </div>

                  {activeTab === 'quiz' && (
                    <div>
                      <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Questions
                      </label>
                      <input
                        type="number"
                        id="numQuestions"
                        name="numQuestions"
                        value={formData.numQuestions}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      />
                    </div>
                  )}

                  {/* Generate Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={
                        activeTab === 'quiz' ? handleGenerateQuiz :
                        activeTab === 'notes' ? handleGenerateNotes :
                        activeTab === 'flashcards' ? handleGenerateFlashcards :
                        handleGenerateAssignment
                      }
                      disabled={isLoading || !formData.topic.trim()}
                      className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="small" className="mr-3" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-6 w-6 mr-3" />
                          Generate {tabs.find(t => t.id === activeTab)?.name}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tab-specific content */}
                <div className="mt-8">
                  {activeTab === 'quiz' && (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                      <AcademicCapIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Generate interactive quizzes with multiple choice questions</p>
                    </div>
                  )}
                  
                  {activeTab === 'notes' && (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                      <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Create comprehensive study notes with key concepts and examples</p>
                    </div>
                  )}
                  
                  {activeTab === 'flashcards' && (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                      <LightBulbIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Generate flashcards for effective memorization and review</p>
                    </div>
                  )}
                  
                  {activeTab === 'assignment' && (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                      <ClipboardDocumentListIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Create structured assignments with various question types</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TeacherDashboard;
