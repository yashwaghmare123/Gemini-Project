
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  SunIcon, 
  MoonIcon, 
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { toggleTheme, setUserRole } from '../store/slices/uiSlice';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme, userRole } = useSelector(state => state.ui);

  const isActive = (path) => location.pathname === path;

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleRoleChange = (role) => {
    dispatch(setUserRole(role));
  };

  return (
    <nav className="sticky top-0 z-50 shadow-lg border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-900 dark:text-white text-xl font-bold">Virtual School</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/teacher"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/teacher') 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Teacher Dashboard
              </Link>
              <Link
                to="/student"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/student') 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Student Dashboard
              </Link>
              <Link
                to="/tutor"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/tutor') 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                AI Tutor
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Role Selector */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => handleRoleChange('teacher')}
                className={`flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  userRole === 'teacher'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BookOpenIcon className="h-3 w-3 mr-1" />
                Teacher
              </button>
              <button
                onClick={() => handleRoleChange('student')}
                className={`flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  userRole === 'student'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <UserGroupIcon className="h-3 w-3 mr-1" />
                Student
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/teacher"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/teacher') 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Teacher Dashboard
            </Link>
            <Link
              to="/student"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/student') 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Student Dashboard
            </Link>
            <Link
              to="/tutor"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/tutor') 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              AI Tutor
            </Link>
            
            {/* Mobile Role Selector */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </p>
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => {
                      handleRoleChange('teacher');
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      userRole === 'teacher'
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Teacher
                  </button>
                  <button
                    onClick={() => {
                      handleRoleChange('student');
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      userRole === 'student'
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;