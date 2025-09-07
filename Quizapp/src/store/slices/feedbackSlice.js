import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// Async thunks
export const generateFeedback = createAsyncThunk(
  'feedback/generateFeedback',
  async ({ studentData }, { rejectWithValue }) => {
    try {
      const response = await api.generateFeedback({ studentData });
      return {
        ...response.data,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate feedback');
    }
  }
);

const initialState = {
  currentFeedback: null,
  feedbackHistory: [],
  loading: false,
  error: null
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearFeedback: (state) => {
      state.currentFeedback = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFeedback = action.payload;
        state.feedbackHistory.unshift(action.payload);
      })
      .addCase(generateFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearFeedback, clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
