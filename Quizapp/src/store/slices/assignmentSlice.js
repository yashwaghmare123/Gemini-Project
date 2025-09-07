import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// Async thunks
export const generateAssignment = createAsyncThunk(
  'assignment/generateAssignment',
  async ({ topic, gradeLevel }, { rejectWithValue }) => {
    try {
      const response = await api.generateAssignment({ topic, gradeLevel });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate assignment');
    }
  }
);

export const submitAssignment = createAsyncThunk(
  'assignment/submitAssignment',
  async ({ answers, assignment }, { rejectWithValue }) => {
    try {
      // Calculate score for multiple choice questions
      let totalPoints = 0;
      let earnedPoints = 0;
      
      const results = assignment.sections.map(section => {
        if (section.type === 'multiple-choice') {
          const sectionResults = section.questions.map((question, qIndex) => {
            const userAnswer = answers[`${section.type}-${qIndex}`];
            const isCorrect = userAnswer === question.correctAnswer;
            totalPoints += question.points;
            if (isCorrect) earnedPoints += question.points;
            
            return {
              question: question.question,
              userAnswer,
              correctAnswer: question.correctAnswer,
              isCorrect,
              points: question.points,
              earnedPoints: isCorrect ? question.points : 0
            };
          });
          return { ...section, results: sectionResults };
        } else {
          // For short answer questions, just store the answers for manual grading
          const sectionResults = section.questions.map((question, qIndex) => {
            const userAnswer = answers[`${section.type}-${qIndex}`];
            totalPoints += question.points;
            
            return {
              question: question.question,
              userAnswer,
              points: question.points,
              needsManualGrading: true
            };
          });
          return { ...section, results: sectionResults };
        }
      });

      const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      
      return {
        score,
        totalPoints,
        earnedPoints,
        results,
        submittedAt: new Date().toISOString(),
        needsManualGrading: assignment.sections.some(s => s.type !== 'multiple-choice')
      };
    } catch (error) {
      return rejectWithValue('Failed to submit assignment');
    }
  }
);

const initialState = {
  currentAssignment: null,
  assignmentHistory: [],
  currentAnswers: {},
  assignmentResult: null,
  loading: false,
  error: null,
  isSubmitted: false
};

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    clearAssignment: (state) => {
      state.currentAssignment = null;
      state.currentAnswers = {};
      state.assignmentResult = null;
      state.isSubmitted = false;
      state.error = null;
    },
    setAnswer: (state, action) => {
      const { questionKey, answer } = action.payload;
      state.currentAnswers[questionKey] = answer;
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
      // Generate Assignment
      .addCase(generateAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssignment = action.payload;
        state.currentAnswers = {};
        state.assignmentResult = null;
        state.isSubmitted = false;
      })
      .addCase(generateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Assignment
      .addCase(submitAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentResult = action.payload;
        state.isSubmitted = true;
        state.assignmentHistory.unshift({
          assignment: state.currentAssignment,
          result: action.payload,
          submittedAt: action.payload.submittedAt
        });
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAssignment, setAnswer, clearAnswers, clearError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
