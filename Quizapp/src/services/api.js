import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 300000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response patterns
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    
    // Handle common error responses
    if (error.response?.status === 401) {
      // Unauthorized - clear auth token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API Methods
export const generateQuiz = async (data) => {
  return api.post('/generate-quiz', data);
};

export const generateNotes = async (data) => {
  return api.post('/generate-notes', data);
};

export const generateFlashcards = async (data) => {
  return api.post('/generate-flashcards', data);
};

export const generateAssignment = async (data) => {
  return api.post('/generate-assignment', data);
};

export const generateFeedback = async (data) => {
  return api.post('/feedback', data);
};

export const askTutor = async (data) => {
  return api.post('/tutor', data);
};

// Image generation endpoints
export const generateImage = async (data) => {
  return api.post('/generate-image', data);
};

export const enhanceImage = async (data) => {
  return api.post('/enhance-image', data);
};

export const healthCheck = async () => {
  return api.get('/health');
};

// Helper function to handle API errors consistently
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.error || `Server error: ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error: Unable to connect to server';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export default api;
