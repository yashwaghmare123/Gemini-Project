import { test, expect } from '@playwright/test';

test('Generate quiz API works', async ({ request }) => {
  const requestBody = {
    topic: "Math",
    numQuestions: 2
  };

  const response = await request.post('http://localhost:5000/api/generate-quiz', {
    data: requestBody
  });

  expect(response.status()).toBe(200);

  const data = await response.json();
  console.log('Quiz generated:', data);

  // Checks
  expect(data.title).toBeTruthy();
  expect(Array.isArray(data.questions)).toBe(true);
  expect(data.questions.length).toBeGreaterThan(0);

  // First question structure check
  const firstQuestion = data.questions[0];
  expect(firstQuestion).toHaveProperty('question');
  expect(firstQuestion).toHaveProperty('options');
  expect(firstQuestion.options.length).toBe(4);
  expect(firstQuestion).toHaveProperty('correctAnswer');
});
