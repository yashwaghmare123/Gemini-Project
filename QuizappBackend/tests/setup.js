// Test setup file
process.env.NODE_ENV = 'test';
process.env.GEMINI_API_KEY = 'test-api-key-for-testing';

// Silence console.log during tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
