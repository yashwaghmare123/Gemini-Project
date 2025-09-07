import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { setCurrentPage } from '../store/slices/uiSlice';
import QuizPlayer from './quiz/QuizPlayer';
import NotesViewer from './notes/NotesViewer';
import FlashcardViewer from './flashcards/FlashcardViewer';
import AITutor from './tutor/AITutor';
import ErrorBoundary from './common/ErrorBoundary';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { currentPage } = useSelector(state => state.ui);
  const { quizHistory } = useSelector(state => state.quiz);
  const { notesHistory } = useSelector(state => state.notes);
  const { flashcardHistory } = useSelector(state => state.flashcards);

  const [stats, setStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    studyStreak: 0,
    totalStudyTime: 0
  });

  useEffect(() => {
    // Calculate user stats
    const completed = quizHistory.length;
    const totalScore = quizHistory.reduce((sum, quiz) => sum + (quiz.result?.score || 0), 0);
    const avgScore = completed > 0 ? Math.round(totalScore / completed) : 0;
    
    setStats({
      quizzesCompleted: completed,
      averageScore: avgScore,
      studyStreak: Math.floor(Math.random() * 15) + 1, // Mock data
      totalStudyTime: Math.floor(Math.random() * 50) + 10 // Mock data in hours
    });
  }, [quizHistory]);

  const handleNavigation = (page) => {
    dispatch(setCurrentPage(page));
  };

  // Render specific components based on current page
  if (currentPage === 'quiz') return <QuizPlayer />;
  if (currentPage === 'notes') return <NotesViewer />;
  if (currentPage === 'flashcards') return <FlashcardViewer />;
  if (currentPage === 'tutor') return <AITutor />;

  const activities = [
    {
      id: 'quiz',
      title: 'Take Quiz',
      description: 'Test your knowledge with AI-generated quizzes',
      icon: AcademicCapIcon,
      color: 'from-blue-500 to-blue-600',
      count: quizHistory.length,
      action: 'Start Quiz'
    },
    {
      id: 'notes',
      title: 'Study Notes',
      description: 'Review comprehensive study materials',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-green-600',
      count: notesHistory.length,
      action: 'View Notes'
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Practice with interactive flashcards',
      icon: LightBulbIcon,
      color: 'from-yellow-500 to-yellow-600',
      count: flashcardHistory.length,
      action: 'Study Cards'
    },
    {
      id: 'tutor',
      title: 'AI Tutor',
      description: 'Get help from your personal AI tutor',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-500 to-purple-600',
      count: 'Always Available',
      action: 'Ask Question'
    }
  ];

  const statCards = [
    {
      title: 'Quizzes Completed',
      value: stats.quizzesCompleted,
      icon: TrophyIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Study Streak',
      value: `${stats.studyStreak} days`,
      icon: FireIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Study Time',
      value: `${stats.totalStudyTime}h`,
      icon: ClockIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const recentActivity = quizHistory.slice(0, 3).map((quiz, index) => ({
    id: index,
    title: quiz.quiz?.title || 'Quiz',
    score: quiz.result?.score || 0,
    date: new Date(quiz.submittedAt).toLocaleDateString(),
    type: 'quiz'
  }));

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Your Learning Journey
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Continue learning with AI-powered educational tools
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className={`${stat.bgColor} rounded-lg p-3`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Learning Activities */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Learning Activities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="relative group cursor-pointer"
                        onClick={() => handleNavigation(activity.id)}
                      >
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 border border-gray-200 dark:border-gray-600">
                          <div className={`w-12 h-12 bg-gradient-to-r ${activity.color} rounded-lg flex items-center justify-center mb-4`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {activity.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {typeof activity.count === 'number' ? `${activity.count} available` : activity.count}
                            </span>
                            <span className={`text-sm font-medium bg-gradient-to-r ${activity.color} bg-clip-text text-transparent`}>
                              {activity.action} →
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Recent Activity & Progress */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">
                            {activity.score}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No recent activity. Start learning to see your progress here!
                  </p>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleNavigation('quiz')}
                    className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                  >
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Take a Quick Quiz
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Test your knowledge
                    </p>
                  </button>
                  <button
                    onClick={() => handleNavigation('tutor')}
                    className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                  >
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Ask AI Tutor
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Get instant help
                    </p>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default StudentDashboard;
