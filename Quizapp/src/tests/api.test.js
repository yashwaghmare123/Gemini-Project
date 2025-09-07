import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from '../services/api';

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    post: vi.fn(),
    get: vi.fn(),
  };
  return { default: mockAxios };
});

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateQuiz', () => {
    it('should call POST /generate-quiz with correct data', async () => {
      const mockResponse = {
        data: {
          title: 'Test Quiz',
          questions: [
            {
              question: 'What is 2+2?',
              options: ['3', '4', '5', '6'],
              correctAnswer: '4',
            },
          ],
        },
      };

      // Mock the axios post method
      const axios = require('axios').default;
      axios.post.mockResolvedValue(mockResponse);

      const requestData = { topic: 'Mathematics', numQuestions: 5 };
      const result = await api.generateQuiz(requestData);

      expect(axios.post).toHaveBeenCalledWith('/generate-quiz', requestData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const axios = require('axios').default;
      const errorResponse = {
        response: {
          data: { error: 'Failed to generate quiz' },
          status: 500,
        },
      };
      
      axios.post.mockRejectedValue(errorResponse);

      const requestData = { topic: 'Mathematics', numQuestions: 5 };
      
      await expect(api.generateQuiz(requestData)).rejects.toEqual(errorResponse);
    });
  });

  describe('generateNotes', () => {
    it('should call POST /generate-notes with correct data', async () => {
      const mockResponse = {
        data: {
          title: 'Notes: Photosynthesis',
          gradeLevel: 'High School',
          sections: [
            {
              heading: 'Introduction',
              content: 'Photosynthesis is...',
              keyPoints: ['Plants convert sunlight', 'Produces oxygen'],
            },
          ],
        },
      };

      const axios = require('axios').default;
      axios.post.mockResolvedValue(mockResponse);

      const requestData = { topic: 'Photosynthesis', gradeLevel: 'High School' };
      const result = await api.generateNotes(requestData);

      expect(axios.post).toHaveBeenCalledWith('/generate-notes', requestData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('generateFlashcards', () => {
    it('should call POST /generate-flashcards with correct data', async () => {
      const mockResponse = {
        data: {
          title: 'Flashcards: Spanish Vocabulary',
          cards: [
            {
              id: 1,
              front: 'Hola',
              back: 'Hello',
              difficulty: 'easy',
            },
          ],
        },
      };

      const axios = require('axios').default;
      axios.post.mockResolvedValue(mockResponse);

      const requestData = { topic: 'Spanish Vocabulary' };
      const result = await api.generateFlashcards(requestData);

      expect(axios.post).toHaveBeenCalledWith('/generate-flashcards', requestData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('generateAssignment', () => {
    it('should call POST /generate-assignment with correct data', async () => {
      const mockResponse = {
        data: {
          title: 'Assignment: World War II',
          gradeLevel: 'High School',
          sections: [
            {
              type: 'multiple-choice',
              title: 'Multiple Choice Questions',
              questions: [
                {
                  question: 'When did WWII start?',
                  options: ['1939', '1940', '1941', '1942'],
                  points: 2,
                },
              ],
            },
          ],
        },
      };

      const axios = require('axios').default;
      axios.post.mockResolvedValue(mockResponse);

      const requestData = { topic: 'World War II', gradeLevel: 'High School' };
      const result = await api.generateAssignment(requestData);

      expect(axios.post).toHaveBeenCalledWith('/generate-assignment', requestData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('askTutor', () => {
    it('should call POST /tutor with correct data', async () => {
      const mockResponse = {
        data: {
          response: 'Photosynthesis is the process...',
          examples: ['Plants use chlorophyll...'],
          relatedTopics: ['Cellular Respiration', 'Plant Biology'],
          practiceQuestions: ['What is chlorophyll?'],
          difficulty: 'beginner',
        },
      };

      const axios = require('axios').default;
      axios.post.mockResolvedValue(mockResponse);

      const requestData = { question: 'What is photosynthesis?', gradeLevel: 'High School' };
      const result = await api.askTutor(requestData);

      expect(axios.post).toHaveBeenCalledWith('/tutor', requestData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('generateFeedback', () => {
    it('should call POST /feedback with correct data', async () => {
      const mockResponse = {
        data: {
          overallScore: 85,
          strengths: ['Good understanding of concepts'],
          improvements: ['Work on time management'],
          recommendations: [
            {
              topic: 'Mathematics',
              action: 'Practice more word problems',
              resources: ['Khan Academy'],
            },
          ],
          encouragement: 'Great work!',
        },
      };

      const axios = require('axios').default;
      axios.post.mockResolvedValue(mockResponse);

      const requestData = {
        studentData: {
          quizScores: [80, 90, 85],
          timeSpent: 120,
          topicsStudied: ['Math', 'Science'],
        },
      };
      const result = await api.generateFeedback(requestData);

      expect(axios.post).toHaveBeenCalledWith('/feedback', requestData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('healthCheck', () => {
    it('should call GET /health', async () => {
      const mockResponse = {
        data: {
          status: 'OK',
          timestamp: '2024-01-01T00:00:00.000Z',
        },
      };

      const axios = require('axios').default;
      axios.get.mockResolvedValue(mockResponse);

      const result = await api.healthCheck();

      expect(axios.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('handleApiError', () => {
    it('should handle response errors', () => {
      const error = {
        response: {
          data: { error: 'Validation failed' },
          status: 400,
        },
      };

      const result = api.handleApiError(error);
      expect(result).toBe('Validation failed');
    });

    it('should handle network errors', () => {
      const error = {
        request: {},
      };

      const result = api.handleApiError(error);
      expect(result).toBe('Network error: Unable to connect to server');
    });

    it('should handle generic errors', () => {
      const error = {
        message: 'Something went wrong',
      };

      const result = api.handleApiError(error);
      expect(result).toBe('Something went wrong');
    });

    it('should handle unknown errors', () => {
      const error = {};

      const result = api.handleApiError(error);
      expect(result).toBe('An unexpected error occurred');
    });
  });
});
