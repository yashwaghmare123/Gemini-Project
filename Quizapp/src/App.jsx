
import React, { useEffect } from "react";
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from './store';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import AITutor from "./components/tutor/AITutor";
import QuizPlayer from "./components/quiz/QuizPlayer";
import NotesViewer from "./components/notes/NotesViewer";
import FlashcardViewer from "./components/flashcards/FlashcardViewer";
import ImageTest from "./components/ImageTest";
import ErrorBoundary from "./components/common/ErrorBoundary";
import NotificationSystem from "./components/common/NotificationSystem";
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/quiz" element={<QuizPlayer />} />
                <Route path="/notes" element={<NotesViewer />} />
                <Route path="/flashcards" element={<FlashcardViewer />} />
                <Route path="/tutor" element={<AITutor />} />
                <Route path="/test-images" element={<ImageTest />} />
              </Routes>
              <NotificationSystem />
            </div>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;