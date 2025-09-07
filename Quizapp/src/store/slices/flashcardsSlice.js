import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// Async thunks
export const generateFlashcards = createAsyncThunk(
  'flashcards/generateFlashcards',
  async ({ topic, includeImages = false }, { rejectWithValue }) => {
    try {
      const response = await api.generateFlashcards({ topic, includeImages });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate flashcards');
    }
  }
);

const initialState = {
  currentDeck: null,
  flashcardHistory: [],
  currentCardIndex: 0,
  isFlipped: false,
  studyStats: {
    cardsStudied: 0,
    correctAnswers: 0,
    sessionStartTime: null
  },
  loading: false,
  error: null
};

const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    clearFlashcards: (state) => {
      state.currentDeck = null;
      state.currentCardIndex = 0;
      state.isFlipped = false;
      state.error = null;
      state.studyStats = {
        cardsStudied: 0,
        correctAnswers: 0,
        sessionStartTime: null
      };
    },
    flipCard: (state) => {
      state.isFlipped = !state.isFlipped;
    },
    nextCard: (state) => {
      if (state.currentDeck && state.currentCardIndex < state.currentDeck.cards.length - 1) {
        state.currentCardIndex += 1;
        state.isFlipped = false;
      }
    },
    previousCard: (state) => {
      if (state.currentCardIndex > 0) {
        state.currentCardIndex -= 1;
        state.isFlipped = false;
      }
    },
    goToCard: (state, action) => {
      const index = action.payload;
      if (state.currentDeck && index >= 0 && index < state.currentDeck.cards.length) {
        state.currentCardIndex = index;
        state.isFlipped = false;
      }
    },
    markCardKnown: (state) => {
      state.studyStats.cardsStudied += 1;
      state.studyStats.correctAnswers += 1;
    },
    markCardUnknown: (state) => {
      state.studyStats.cardsStudied += 1;
    },
    startStudySession: (state) => {
      state.studyStats.sessionStartTime = new Date().toISOString();
      state.studyStats.cardsStudied = 0;
      state.studyStats.correctAnswers = 0;
    },
    shuffleDeck: (state) => {
      if (state.currentDeck && state.currentDeck.cards) {
        const shuffled = [...state.currentDeck.cards];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        state.currentDeck.cards = shuffled;
        state.currentCardIndex = 0;
        state.isFlipped = false;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateFlashcards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateFlashcards.fulfilled, (state, action) => {
        state.loading = false;
        console.log('🃏 Flashcards generated:', action.payload);
        console.log('🖼️ Image in flashcards:', action.payload.image);
        state.currentDeck = action.payload;
        state.currentCardIndex = 0;
        state.isFlipped = false;
        state.flashcardHistory.unshift({
          ...action.payload,
          generatedAt: new Date().toISOString()
        });
      })
      .addCase(generateFlashcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearFlashcards,
  flipCard,
  nextCard,
  previousCard,
  goToCard,
  markCardKnown,
  markCardUnknown,
  startStudySession,
  shuffleDeck,
  clearError
} = flashcardsSlice.actions;

export default flashcardsSlice.reducer;
