import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// Async thunks
export const generateQuiz = createAsyncThunk(
  'quiz/generateQuiz',
  async ({ topic, numQuestions, includeImages = false }, { rejectWithValue }) => {
    try {
      const response = await api.generateQuiz({ topic, numQuestions, includeImages });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate quiz');
    }
  }
);

export const submitQuizAnswers = createAsyncThunk(
  'quiz/submitAnswers',
  async ({ answers, quiz }, { rejectWithValue }) => {
    try {
      // Calculate score locally
      let score = 0;
      const results = quiz.questions.map((question, index) => {
        const isCorrect = answers[index] === question.correctAnswer;
        if (isCorrect) score++;
        return {
          questionId: question.id || index + 1,
          question: question.question,
          userAnswer: answers[index],
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation
        };
      });

      const finalScore = Math.round((score / quiz.questions.length) * 100);
      
      return {
        score: finalScore,
        totalQuestions: quiz.questions.length,
        correctAnswers: score,
        results,
        completedAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue('Failed to submit quiz');
    }
  }
);

const initialState = {
  currentQuiz: null,
  quizHistory: [],
  currentAnswers: {},
  quizResult: null,
  loading: false,
  error: null,
  isSubmitted: false
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearQuiz: (state) => {
      state.currentQuiz = null;
      state.currentAnswers = {};
      state.quizResult = null;
      state.isSubmitted = false;
      state.error = null;
    },
    setAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload;
      state.currentAnswers[questionIndex] = answer;
    },
    clearAnswers: (state) => {
      state.currentAnswers = {};
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate Quiz
      .addCase(generateQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
        state.currentAnswers = {};
        state.quizResult = null;
        state.isSubmitted = false;
      })
      .addCase(generateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Quiz
      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.quizResult = action.payload;
        state.isSubmitted = true;
        state.quizHistory.unshift({
          quiz: state.currentQuiz,
          result: action.payload,
          submittedAt: action.payload.completedAt
        });
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearQuiz, setAnswer, clearAnswers, clearError } = quizSlice.actions;
export default quizSlice.reducer;
