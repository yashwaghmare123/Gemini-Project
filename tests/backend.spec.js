const request = require("supertest");
const app = require("../QuizappBackend/index"); // path check karo

describe("POST /api/generate-quiz", () => {
  it("should generate a quiz successfully", async () => {
    const response = await request(app)
      .post("/api/generate-quiz")
      .send({ topic: "Math", numQuestions: 2 })
      .expect(200);

    const data = response.body;
    console.log("Quiz generated:", data);

    // Basic checks
    expect(data.title).toBeTruthy();
    expect(Array.isArray(data.questions)).toBe(true);
    expect(data.questions.length).toBeGreaterThan(0);

    const firstQuestion = data.questions[0];
    expect(firstQuestion).toHaveProperty("question");
    expect(firstQuestion).toHaveProperty("options");
    expect(firstQuestion.options.length).toBe(4);
    expect(firstQuestion).toHaveProperty("correctAnswer");
  });
});
