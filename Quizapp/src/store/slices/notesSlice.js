import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// Async thunks
export const generateNotes = createAsyncThunk(
  'notes/generateNotes',
  async ({ topic, gradeLevel, includeImages = false }, { rejectWithValue }) => {
    try {
      const response = await api.generateNotes({ topic, gradeLevel, includeImages });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate notes');
    }
  }
);

const initialState = {
  currentNotes: null,
  notesHistory: [],
  loading: false,
  error: null,
  expandedSections: []
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearNotes: (state) => {
      state.currentNotes = null;
      state.error = null;
      state.expandedSections = [];
    },
    toggleSection: (state, action) => {
      const sectionIndex = action.payload;
      if (state.expandedSections.includes(sectionIndex)) {
        state.expandedSections = state.expandedSections.filter(index => index !== sectionIndex);
      } else {
        state.expandedSections.push(sectionIndex);
      }
    },
    expandAllSections: (state) => {
      if (state.currentNotes && state.currentNotes.sections) {
        state.expandedSections = state.currentNotes.sections.map((_, index) => index);
      }
    },
    collapseAllSections: (state) => {
      state.expandedSections = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateNotes.fulfilled, (state, action) => {
        state.loading = false;
        console.log('📝 Notes generated:', action.payload);
        console.log('🖼️ Image in notes:', action.payload.image);
        state.currentNotes = action.payload;
        state.expandedSections = [0]; // Expand first section by default
        state.notesHistory.unshift({
          ...action.payload,
          generatedAt: new Date().toISOString()
        });
      })
      .addCase(generateNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearNotes, 
  toggleSection, 
  expandAllSections, 
  collapseAllSections, 
  clearError 
} = notesSlice.actions;

export default notesSlice.reducer;
