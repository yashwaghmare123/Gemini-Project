import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  UserIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  TrashIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { askTutor, setCurrentQuestion, clearChatHistory } from '../../store/slices/tutorSlice';
import { setCurrentPage, addNotification } from '../../store/slices/uiSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const AITutor = () => {
  const dispatch = useDispatch();
  const { chatHistory, currentQuestion, isTyping, loading } = useSelector(state => state.tutor);
  const [inputMessage, setInputMessage] = useState('');
  const [gradeLevel, setGradeLevel] = useState('General');
  const [includeImages, setIncludeImages] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const gradeLevels = [
    'Elementary', 'Middle School', 'High School', 'College', 'Graduate', 'General'
  ];

  const suggestedQuestions = [
    "What is photosynthesis?",
    "How do I solve quadratic equations?",
    "Explain the causes of World War I",
    "What are the differences between mitosis and meiosis?",
    "How does gravity work?",
    "What is the scientific method?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const question = inputMessage.trim();
    setInputMessage('');

    try {
      await dispatch(askTutor({ 
        question, 
        gradeLevel: gradeLevel === 'General' ? undefined : gradeLevel,
        includeImages
      })).unwrap();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to get tutor response'
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    dispatch(clearChatHistory());
    dispatch(addNotification({
      type: 'success',
      message: 'Chat history cleared'
    }));
  };

  const TutorMessage = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start space-x-3"
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
          <AcademicCapIcon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-w-3xl">
        <div className="text-gray-900 dark:text-white space-y-3">
          <p className="whitespace-pre-wrap">{message.message}</p>
          
          {/* Generated Image */}
          {message.image && (
            <div className="mt-4">
              <img 
                src={`http://localhost:3001/api/images/${message.image.split('/').pop()}`}
                alt="Educational illustration"
                className="max-w-sm mx-auto rounded-lg shadow-lg"
                onLoad={() => console.log('✅ Tutor image loaded successfully')}
                onError={(e) => {
                  console.error('❌ Tutor image failed to load:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {message.examples && message.examples.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2 flex items-center">
                <LightBulbIcon className="h-4 w-4 mr-1" />
                Examples:
              </h4>
              <ul className="space-y-1">
                {message.examples.map((example, index) => (
                  <li key={index} className="text-sm bg-purple-50 dark:bg-purple-900 p-2 rounded">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {message.relatedTopics && message.relatedTopics.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Related Topics:
              </h4>
              <div className="flex flex-wrap gap-2">
                {message.relatedTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {message.practiceQuestions && message.practiceQuestions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
                <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
                Practice Questions:
              </h4>
              <ul className="space-y-1">
                {message.practiceQuestions.map((question, index) => (
                  <li key={index} className="text-sm bg-green-50 dark:bg-green-900 p-2 rounded">
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );

  const UserMessage = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start space-x-3 justify-end"
    >
      <div className="flex-1 bg-blue-500 text-white rounded-lg p-4 max-w-md ml-12">
        <p className="whitespace-pre-wrap">{message.message}</p>
        <p className="text-xs text-blue-100 mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <UserIcon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-start space-x-3"
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
          <AcademicCapIcon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => dispatch(setCurrentPage('dashboard'))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI Tutor
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ask me anything and I'll help you learn!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {gradeLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span>Include Images</span>
              </label>
              
              <button
                onClick={handleClearChat}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                title="Clear chat history"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                    <AcademicCapIcon className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Welcome to AI Tutor!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      I'm here to help you learn and understand any topic. Ask me questions, and I'll provide explanations, examples, and practice problems.
                    </p>
                  </div>
                  
                  {/* Suggested Questions */}
                  <div className="max-w-2xl mx-auto">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Try asking me about:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestedQuestions.map((question, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all duration-200"
                        >
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {question}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <AnimatePresence>
                {chatHistory.map((message, index) => (
                  <div key={index}>
                    {message.type === 'user' ? (
                      <UserMessage message={message} />
                    ) : message.type === 'tutor' ? (
                      <TutorMessage message={message} />
                    ) : (
                      <div className="text-center">
                        <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900 p-2 rounded-lg inline-block">
                          {message.message}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none min-h-[44px] max-h-32"
                  rows={1}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || loading}
                className="p-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AITutor;
