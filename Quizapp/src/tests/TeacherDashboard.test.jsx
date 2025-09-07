import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TeacherDashboard from '../components/TeacherDashboard';
import quizSlice from '../store/slices/quizSlice';
import notesSlice from '../store/slices/notesSlice';
import flashcardsSlice from '../store/slices/flashcardsSlice';
import assignmentSlice from '../store/slices/assignmentSlice';
import uiSlice from '../store/slices/uiSlice';

// Mock API
vi.mock('../services/api', () => ({
  generateQuiz: vi.fn(),
  generateNotes: vi.fn(),
  generateFlashcards: vi.fn(),
  generateAssignment: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      quiz: quizSlice,
      notes: notesSlice,
      flashcards: flashcardsSlice,
      assignment: assignmentSlice,
      ui: uiSlice,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (ui, { initialState = {}, ...renderOptions } = {}) => {
  const store = createTestStore(initialState);
  
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }
  
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('TeacherDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders teacher dashboard with all tabs', () => {
    renderWithProviders(<TeacherDashboard />);
    
    expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create educational content with AI assistance')).toBeInTheDocument();
    
    // Check for tab buttons
    expect(screen.getByRole('button', { name: /quiz/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /flashcards/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /assignment/i })).toBeInTheDocument();
  });

  it('switches between tabs correctly', () => {
    renderWithProviders(<TeacherDashboard />);
    
    // Default tab should be quiz
    expect(screen.getByPlaceholderText(/enter the topic/i)).toBeInTheDocument();
    
    // Click on notes tab
    fireEvent.click(screen.getByRole('button', { name: /notes/i }));
    expect(screen.getByLabelText(/grade level/i)).toBeInTheDocument();
    
    // Click on flashcards tab
    fireEvent.click(screen.getByRole('button', { name: /flashcards/i }));
    expect(screen.getByText(/generate flashcards for effective memorization/i)).toBeInTheDocument();
  });

  it('shows validation error for empty topic', async () => {
    const { store } = renderWithProviders(<TeacherDashboard />);
    
    const generateButton = screen.getByRole('button', { name: /generate quiz/i });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      const state = store.getState();
      // Check if notification was added (since we can't directly test the notification display without more setup)
      expect(state.ui.notifications).toHaveLength(1);
      expect(state.ui.notifications[0].type).toBe('error');
      expect(state.ui.notifications[0].message).toBe('Please enter a topic for the quiz');
    });
  });

  it('handles form input changes', () => {
    renderWithProviders(<TeacherDashboard />);
    
    const topicInput = screen.getByPlaceholderText(/enter the topic/i);
    fireEvent.change(topicInput, { target: { value: 'Mathematics' } });
    
    expect(topicInput).toHaveValue('Mathematics');
  });

  it('shows loading state when generating content', () => {
    const initialState = {
      quiz: { loading: true },
      notes: { loading: false },
      flashcards: { loading: false },
      assignment: { loading: false },
    };
    
    renderWithProviders(<TeacherDashboard />, { initialState });
    
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
  });

  it('displays grade level selector for notes and assignments', () => {
    renderWithProviders(<TeacherDashboard />);
    
    // Switch to notes tab
    fireEvent.click(screen.getByRole('button', { name: /notes/i }));
    expect(screen.getByLabelText(/grade level/i)).toBeInTheDocument();
    
    // Switch to assignment tab  
    fireEvent.click(screen.getByRole('button', { name: /assignment/i }));
    expect(screen.getByLabelText(/grade level/i)).toBeInTheDocument();
    
    // Switch to quiz tab - should not have grade level
    fireEvent.click(screen.getByRole('button', { name: /quiz/i }));
    expect(screen.queryByLabelText(/grade level/i)).not.toBeInTheDocument();
  });

  it('shows number of questions input for quiz', () => {
    renderWithProviders(<TeacherDashboard />);
    
    expect(screen.getByLabelText(/number of questions/i)).toBeInTheDocument();
    
    const questionsInput = screen.getByLabelText(/number of questions/i);
    fireEvent.change(questionsInput, { target: { value: '10' } });
    expect(questionsInput).toHaveValue(10);
  });

  it('disables generate button when loading', () => {
    const initialState = {
      quiz: { loading: true },
    };
    
    renderWithProviders(<TeacherDashboard />, { initialState });
    
    const generateButton = screen.getByRole('button', { name: /generating/i });
    expect(generateButton).toBeDisabled();
  });
});
