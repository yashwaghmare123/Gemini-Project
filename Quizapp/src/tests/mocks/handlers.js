import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock quiz generation
  http.post('http://localhost:3001/api/generate-quiz', () => {
    return HttpResponse.json({
      topic: 'React Hooks',
      questions: [
        {
          question: 'What is useState?',
          options: ['A hook for state', 'A component', 'A method', 'A prop'],
          correctAnswer: 0,
          explanation: 'useState is a React hook for managing state'
        }
      ]
    });
  }),

  // Mock notes generation
  http.post('http://localhost:3001/api/generate-notes', () => {
    return HttpResponse.json({
      topic: 'React Hooks',
      content: [
        {
          section: 'Introduction',
          content: 'React hooks are functions that let you use state and other React features.'
        }
      ]
    });
  }),

  // Mock flashcards generation
  http.post('http://localhost:3001/api/generate-flashcards', () => {
    return HttpResponse.json({
      topic: 'React Hooks',
      flashcards: [
        {
          front: 'What is useState?',
          back: 'A React hook for managing state in functional components'
        }
      ]
    });
  }),

  // Mock assignment generation
  http.post('http://localhost:3001/api/generate-assignment', () => {
    return HttpResponse.json({
      topic: 'React Hooks',
      title: 'React Hooks Assignment',
      questions: [
        {
          question: 'Explain useState hook',
          type: 'essay',
          points: 10
        }
      ]
    });
  }),

  // Mock tutor chat
  http.post('http://localhost:3001/api/tutor', () => {
    return HttpResponse.json({
      response: 'I can help you understand React hooks better!'
    });
  }),

  // Mock feedback
  http.post('http://localhost:3001/api/feedback', () => {
    return HttpResponse.json({
      feedback: 'Great work! You have a good understanding of the concepts.'
    });
  }),
];
