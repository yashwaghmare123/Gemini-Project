import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// Async thunks
export const askTutor = createAsyncThunk(
  'tutor/askTutor',
  async ({ question, gradeLevel, includeImages = false }, { rejectWithValue }) => {
    try {
      const response = await api.askTutor({ question, gradeLevel, includeImages });
      return {
        ...response.data,
        question,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get tutor response');
    }
  }
);

const initialState = {
  chatHistory: [],
  currentQuestion: '',
  isTyping: false,
  loading: false,
  error: null
};

const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    clearCurrentQuestion: (state) => {
      state.currentQuestion = '';
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    addUserMessage: (state, action) => {
      state.chatHistory.push({
        type: 'user',
        message: action.payload,
        timestamp: new Date().toISOString()
      });
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(askTutor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isTyping = true;
      })
      .addCase(askTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        
        console.log('🤖 Tutor response received:', action.payload);
        console.log('🖼️ Image in tutor response:', action.payload.image);
        
        // Add user question to chat history
        state.chatHistory.push({
          type: 'user',
          message: action.payload.question,
          timestamp: action.payload.timestamp
        });
        
        // Add tutor response to chat history
        state.chatHistory.push({
          type: 'tutor',
          message: action.payload.response,
          examples: action.payload.examples,
          relatedTopics: action.payload.relatedTopics,
          practiceQuestions: action.payload.practiceQuestions,
          difficulty: action.payload.difficulty,
          image: action.payload.image,
          timestamp: action.payload.timestamp
        });
        
        state.currentQuestion = '';
      })
      .addCase(askTutor.rejected, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        state.error = action.payload;
        
        // Add error message to chat
        state.chatHistory.push({
          type: 'error',
          message: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString()
        });
      });
  }
});

export const {
  setCurrentQuestion,
  clearCurrentQuestion,
  clearChatHistory,
  setTyping,
  addUserMessage,
  clearError
} = tutorSlice.actions;

export default tutorSlice.reducer;
