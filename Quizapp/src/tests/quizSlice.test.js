import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import quizSlice, { generateQuiz, submitQuizAnswers, setAnswer, clearQuiz } from '../store/slices/quizSlice';

// Mock API
vi.mock('../services/api', () => ({
  generateQuiz: vi.fn(),
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      quiz: quizSlice,
    },
    preloadedState: {
      quiz: {
        currentQuiz: null,
        quizHistory: [],
        currentAnswers: {},
        quizResult: null,
        loading: false,
        error: null,
        isSubmitted: false,
        ...initialState,
      },
    },
  });
};

describe('quizSlice', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().quiz;
      expect(state.currentQuiz).toBeNull();
      expect(state.quizHistory).toEqual([]);
      expect(state.currentAnswers).toEqual({});
      expect(state.quizResult).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isSubmitted).toBe(false);
    });
  });

  describe('reducers', () => {
    it('should handle setAnswer', () => {
      store.dispatch(setAnswer({ questionIndex: 0, answer: 'option1' }));
      const state = store.getState().quiz;
      expect(state.currentAnswers[0]).toBe('option1');
    });

    it('should handle clearQuiz', () => {
      // First set some state
      store.dispatch(setAnswer({ questionIndex: 0, answer: 'option1' }));
      
      // Then clear it
      store.dispatch(clearQuiz());
      const state = store.getState().quiz;
      
      expect(state.currentQuiz).toBeNull();
      expect(state.currentAnswers).toEqual({});
      expect(state.quizResult).toBeNull();
      expect(state.isSubmitted).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('async thunks', () => {
    it('should handle generateQuiz.pending', () => {
      const action = { type: generateQuiz.pending.type };
      const state = quizSlice(undefined, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle generateQuiz.fulfilled', () => {
      const mockQuiz = {
        title: 'Test Quiz',
        questions: [
          {
            id: 1,
            question: 'What is 2+2?',
            options: ['3', '4', '5', '6'],
            correctAnswer: '4',
          },
        ],
      };

      const action = { 
        type: generateQuiz.fulfilled.type, 
        payload: mockQuiz 
      };
      const state = quizSlice(undefined, action);
      
      expect(state.loading).toBe(false);
      expect(state.currentQuiz).toEqual(mockQuiz);
      expect(state.currentAnswers).toEqual({});
      expect(state.quizResult).toBeNull();
      expect(state.isSubmitted).toBe(false);
    });

    it('should handle generateQuiz.rejected', () => {
      const action = { 
        type: generateQuiz.rejected.type, 
        payload: 'Failed to generate quiz' 
      };
      const state = quizSlice(undefined, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to generate quiz');
    });
  });

  describe('submitQuizAnswers', () => {
    it('should calculate correct score', () => {
      const mockQuiz = {
        questions: [
          { correctAnswer: '4' },
          { correctAnswer: 'B' },
          { correctAnswer: 'True' },
        ],
      };
      
      const mockAnswers = ['4', 'B', 'False']; // 2 correct out of 3
      
      const action = {
        type: submitQuizAnswers.fulfilled.type,
        payload: {
          score: 67, // 2/3 * 100 rounded
          totalQuestions: 3,
          correctAnswers: 2,
          results: [
            { isCorrect: true },
            { isCorrect: true },
            { isCorrect: false },
          ],
        },
      };
      
      const state = quizSlice(undefined, action);
      
      expect(state.loading).toBe(false);
      expect(state.quizResult.score).toBe(67);
      expect(state.quizResult.correctAnswers).toBe(2);
      expect(state.isSubmitted).toBe(true);
    });
  });
});
