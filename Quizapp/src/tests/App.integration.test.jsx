import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';
import { quizSlice } from '../store/slices/quizSlice';
import { notesSlice } from '../store/slices/notesSlice';
import { uiSlice } from '../store/slices/uiSlice';
import { ThemeProvider } from '../context/ThemeContext';

// Mock API calls
vi.mock('../services/api', () => ({
  generateQuiz: vi.fn(() => Promise.resolve({
    data: {
      topic: 'React Hooks',
      questions: [
        {
          question: 'What is useState?',
          options: ['A hook', 'A component', 'A method', 'A prop'],
          correctAnswer: 0,
          explanation: 'useState is a React hook'
        }
      ]
    }
  })),
  generateNotes: vi.fn(() => Promise.resolve({
    data: {
      topic: 'React Hooks',
      content: [
        {
          section: 'Introduction',
          content: 'React hooks are functions...'
        }
      ]
    }
  }))
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      quiz: quizSlice.reducer,
      notes: notesSlice.reducer,
      ui: uiSlice.reducer,
    },
  });
};

const renderWithProviders = (ui, { store = createTestStore() } = {}) => {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </Provider>
  );
};

describe('App Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
  });

  it('should render the main navigation', () => {
    renderWithProviders(<App />, { store });
    
    expect(screen.getByText('Virtual School')).toBeInTheDocument();
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
  });

  it('should switch between teacher and student dashboards', async () => {
    renderWithProviders(<App />, { store });
    
    // Click on Teacher tab
    fireEvent.click(screen.getByText('Teacher'));
    await waitFor(() => {
      expect(screen.getByText('Create Learning Content')).toBeInTheDocument();
    });
    
    // Click on Student tab
    fireEvent.click(screen.getByText('Student'));
    await waitFor(() => {
      expect(screen.getByText('Your Learning Journey')).toBeInTheDocument();
    });
  });

  it('should handle quiz generation flow', async () => {
    renderWithProviders(<App />, { store });
    
    // Navigate to teacher dashboard
    fireEvent.click(screen.getByText('Teacher'));
    
    // Click on Quiz tab
    fireEvent.click(screen.getByText('Quiz'));
    
    // Fill in the form
    const topicInput = screen.getByPlaceholderText('Enter topic (e.g., React Hooks)');
    const difficultySelect = screen.getByRole('combobox');
    const generateButton = screen.getByText('Generate Quiz');
    
    fireEvent.change(topicInput, { target: { value: 'React Hooks' } });
    fireEvent.change(difficultySelect, { target: { value: 'medium' } });
    fireEvent.click(generateButton);
    
    // Check if loading state is shown
    expect(screen.getByText('Generating quiz...')).toBeInTheDocument();
    
    // Wait for quiz to be generated
    await waitFor(() => {
      expect(screen.getByText('What is useState?')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should handle theme switching', () => {
    renderWithProviders(<App />, { store });
    
    const themeToggle = screen.getByRole('button', { name: /theme/i });
    fireEvent.click(themeToggle);
    
    // Check if theme class changes on document
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should display error notifications', async () => {
    // Mock API to throw error
    const { generateQuiz } = await import('../services/api');
    generateQuiz.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithProviders(<App />, { store });
    
    // Navigate to teacher dashboard and try to generate quiz
    fireEvent.click(screen.getByText('Teacher'));
    fireEvent.click(screen.getByText('Quiz'));
    
    const topicInput = screen.getByPlaceholderText('Enter topic (e.g., React Hooks)');
    const generateButton = screen.getByText('Generate Quiz');
    
    fireEvent.change(topicInput, { target: { value: 'React Hooks' } });
    fireEvent.click(generateButton);
    
    // Check for error notification
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should handle responsive design', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    renderWithProviders(<App />, { store });
    
    // Check if mobile-specific elements are rendered
    expect(screen.getByText('Virtual School')).toBeInTheDocument();
  });
});
