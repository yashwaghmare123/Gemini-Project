const request = require('supertest');
const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');

// Mock the Google Generative AI module
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({
              title: 'Test Quiz',
              questions: [
                {
                  id: 1,
                  question: 'What is 2+2?',
                  options: ['3', '4', '5', '6'],
                  correctAnswer: '4',
                  explanation: '2+2 equals 4'
                }
              ]
            })
          }
        })
      }))
    }))
  };
});

// Set environment variables for testing
process.env.GEMINI_API_KEY = 'test-api-key';
process.env.NODE_ENV = 'test';

const app = require('../index');

describe('Virtual School API', () => {
  describe('Health Check', () => {
    it('GET /api/health should return 200', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(res.body.status).toBe('OK');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('Quiz Generation', () => {
    it('POST /api/generate-quiz should generate a quiz', async () => {
      const quizData = {
        topic: 'Mathematics',
        numQuestions: 5
      };

      const res = await request(app)
        .post('/api/generate-quiz')
        .send(quizData)
        .expect(200);

      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('questions');
      expect(Array.isArray(res.body.questions)).toBe(true);
    });

    it('POST /api/generate-quiz should validate input', async () => {
      const res = await request(app)
        .post('/api/generate-quiz')
        .send({})
        .expect(400);

      expect(res.body.error).toContain('Topic is required');
    });

    it('POST /api/generate-quiz should validate numQuestions', async () => {
      const res = await request(app)
        .post('/api/generate-quiz')
        .send({
          topic: 'Math',
          numQuestions: 25 // Invalid: too many questions
        })
        .expect(400);

      expect(res.body.error).toContain('Number of questions must be between 1 and 20');
    });
  });

  describe('Notes Generation', () => {
    beforeAll(() => {
      // Mock different response for notes
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockInstance = new GoogleGenerativeAI();
      mockInstance.getGenerativeModel().generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            title: 'Notes: Photosynthesis',
            gradeLevel: 'High School',
            sections: [
              {
                heading: 'Introduction',
                content: 'Photosynthesis is the process...',
                keyPoints: ['Plants convert sunlight', 'Produces oxygen']
              }
            ],
            summary: 'Brief summary of photosynthesis'
          })
        }
      });
    });

    it('POST /api/generate-notes should generate notes', async () => {
      const notesData = {
        topic: 'Photosynthesis',
        gradeLevel: 'High School'
      };

      const res = await request(app)
        .post('/api/generate-notes')
        .send(notesData)
        .expect(200);

      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('gradeLevel');
      expect(res.body).toHaveProperty('sections');
      expect(Array.isArray(res.body.sections)).toBe(true);
    });

    it('POST /api/generate-notes should validate input', async () => {
      const res = await request(app)
        .post('/api/generate-notes')
        .send({ topic: '' })
        .expect(400);

      expect(res.body.error).toContain('Topic is required');
    });
  });

  describe('Flashcards Generation', () => {
    beforeAll(() => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockInstance = new GoogleGenerativeAI();
      mockInstance.getGenerativeModel().generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            title: 'Flashcards: Spanish Vocabulary',
            cards: [
              {
                id: 1,
                front: 'Hola',
                back: 'Hello',
                difficulty: 'easy'
              }
            ]
          })
        }
      });
    });

    it('POST /api/generate-flashcards should generate flashcards', async () => {
      const flashcardsData = {
        topic: 'Spanish Vocabulary'
      };

      const res = await request(app)
        .post('/api/generate-flashcards')
        .send(flashcardsData)
        .expect(200);

      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('cards');
      expect(Array.isArray(res.body.cards)).toBe(true);
    });

    it('POST /api/generate-flashcards should validate input', async () => {
      const res = await request(app)
        .post('/api/generate-flashcards')
        .send({})
        .expect(400);

      expect(res.body.error).toContain('Topic is required');
    });
  });

  describe('Assignment Generation', () => {
    beforeAll(() => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockInstance = new GoogleGenerativeAI();
      mockInstance.getGenerativeModel().generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            title: 'Assignment: World War II',
            gradeLevel: 'High School',
            instructions: 'Complete all sections...',
            estimatedTime: '30-45 minutes',
            sections: [
              {
                type: 'multiple-choice',
                title: 'Multiple Choice Questions',
                questions: [
                  {
                    question: 'When did WWII start?',
                    options: ['1939', '1940', '1941', '1942'],
                    points: 2
                  }
                ]
              }
            ],
            totalPoints: 25
          })
        }
      });
    });

    it('POST /api/generate-assignment should generate assignment', async () => {
      const assignmentData = {
        topic: 'World War II',
        gradeLevel: 'High School'
      };

      const res = await request(app)
        .post('/api/generate-assignment')
        .send(assignmentData)
        .expect(200);

      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('gradeLevel');
      expect(res.body).toHaveProperty('sections');
      expect(res.body).toHaveProperty('totalPoints');
    });
  });

  describe('AI Tutor', () => {
    beforeAll(() => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockInstance = new GoogleGenerativeAI();
      mockInstance.getGenerativeModel().generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            response: 'Photosynthesis is the process by which plants...',
            examples: ['Plants use chlorophyll to capture sunlight'],
            relatedTopics: ['Cellular Respiration', 'Plant Biology'],
            practiceQuestions: ['What is chlorophyll?', 'Where does photosynthesis occur?'],
            difficulty: 'beginner'
          })
        }
      });
    });

    it('POST /api/tutor should provide tutor response', async () => {
      const tutorData = {
        question: 'What is photosynthesis?',
        gradeLevel: 'High School'
      };

      const res = await request(app)
        .post('/api/tutor')
        .send(tutorData)
        .expect(200);

      expect(res.body).toHaveProperty('response');
      expect(res.body).toHaveProperty('examples');
      expect(res.body).toHaveProperty('relatedTopics');
      expect(res.body).toHaveProperty('practiceQuestions');
    });

    it('POST /api/tutor should validate input', async () => {
      const res = await request(app)
        .post('/api/tutor')
        .send({})
        .expect(400);

      expect(res.body.error).toContain('Question is required');
    });
  });

  describe('Feedback Generation', () => {
    beforeAll(() => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockInstance = new GoogleGenerativeAI();
      mockInstance.getGenerativeModel().generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            overallScore: 85,
            strengths: ['Good understanding of concepts', 'Strong analytical skills'],
            improvements: ['Work on time management', 'Review chapter 3'],
            recommendations: [
              {
                topic: 'Mathematics',
                action: 'Practice more word problems',
                resources: ['Khan Academy', 'Textbook Ch. 5']
              }
            ],
            encouragement: 'Great work! Keep practicing and you will improve even more.'
          })
        }
      });
    });

    it('POST /api/feedback should generate feedback', async () => {
      const feedbackData = {
        studentData: {
          quizScores: [80, 90, 85],
          timeSpent: 120,
          topicsStudied: ['Math', 'Science']
        }
      };

      const res = await request(app)
        .post('/api/feedback')
        .send(feedbackData)
        .expect(200);

      expect(res.body).toHaveProperty('overallScore');
      expect(res.body).toHaveProperty('strengths');
      expect(res.body).toHaveProperty('improvements');
      expect(res.body).toHaveProperty('recommendations');
    });

    it('POST /api/feedback should validate input', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .send({})
        .expect(400);

      expect(res.body.error).toContain('Student data is required');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app)
        .get('/api/unknown-endpoint')
        .expect(404);

      expect(res.body.error).toBe('Endpoint not found');
    });

    it('should handle invalid JSON', async () => {
      const res = await request(app)
        .post('/api/generate-quiz')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const res = await request(app)
        .options('/api/health')
        .expect(204);

      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
