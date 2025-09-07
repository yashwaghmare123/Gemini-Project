import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userRole: 'student', // 'teacher' or 'student'
  currentPage: 'dashboard',
  theme: 'light', // 'light' or 'dark'
  notifications: [],
  isLoading: false,
  globalError: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        timestamp: new Date().toISOString()
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setGlobalError: (state, action) => {
      state.globalError = action.payload;
    },
    clearGlobalError: (state) => {
      state.globalError = null;
    }
  }
});

export const {
  setUserRole,
  setCurrentPage,
  toggleTheme,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setGlobalError,
  clearGlobalError
} = uiSlice.actions;

export default uiSlice.reducer;
