import { configureStore } from '@reduxjs/toolkit';
import quizSlice from './slices/quizSlice';
import notesSlice from './slices/notesSlice';
import flashcardsSlice from './slices/flashcardsSlice';
import assignmentSlice from './slices/assignmentSlice';
import tutorSlice from './slices/tutorSlice';
import feedbackSlice from './slices/feedbackSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    quiz: quizSlice,
    notes: notesSlice,
    flashcards: flashcardsSlice,
    assignment: assignmentSlice,
    tutor: tutorSlice,
    feedback: feedbackSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export for type inference in components
export const getState = () => store.getState();
export const dispatch = store.dispatch;
