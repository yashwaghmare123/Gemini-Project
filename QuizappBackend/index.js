const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleGenAI } = require("@google/genai");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "http://localhost:3001", "http://localhost:5173", "*"],
      "connect-src": ["'self'", "http://localhost:3001"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174",
    process.env.FRONTEND_ORIGIN || "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Image generation setup
const imageAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// API endpoint to serve images with proper CORS headers
app.get('/api/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(imagesDir, filename);
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Set proper headers for cross-origin access
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Cache-Control', 'public, max-age=31536000');
  
  // Send the image file
  res.sendFile(imagePath);
});

// Serve static images with CORS headers (fallback)
app.options('/images/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.sendStatus(200);
});

app.use('/images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(imagesDir));

// Utility function to clean Gemini response
const cleanGeminiResponse = (responseText) => {
  return responseText.replace(/```json|```/g, "").trim();
};

// Utility function to generate and save image
const generateAndSaveImage = async (prompt, filename) => {
  try {
    const response = await imageAI.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        const filepath = path.join(imagesDir, filename);
        fs.writeFileSync(filepath, buffer);
        return `/images/${filename}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};

// Validation middleware
const validateQuizInput = (req, res, next) => {
  const { topic, numQuestions } = req.body;
  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return res.status(400).json({ error: "Topic is required and must be a non-empty string" });
  }
  if (!numQuestions || typeof numQuestions !== 'number' || numQuestions < 1 || numQuestions > 20) {
    return res.status(400).json({ error: "Number of questions must be between 1 and 20" });
  }
  next();
};

const validateNotesInput = (req, res, next) => {
  const { topic, gradeLevel } = req.body;
  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return res.status(400).json({ error: "Topic is required and must be a non-empty string" });
  }
  if (!gradeLevel || typeof gradeLevel !== 'string') {
    return res.status(400).json({ error: "Grade level is required" });
  }
  next();
};

// API Endpoints

// Generate Quiz
app.post("/api/generate-quiz", validateQuizInput, async (req, res) => {
  const { topic, numQuestions, includeImages = false } = req.body;

  try {
    const prompt = `
Create a quiz on the topic "${topic}".
Include ${numQuestions} multiple-choice questions with 4 options each.
Make sure questions are educational and appropriate.
Return only a JSON object like this:

{
  "title": "Quiz on ${topic}",
  "description": "Test your knowledge on ${topic}",
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "option2",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = cleanGeminiResponse(responseText);

    const quizData = JSON.parse(responseText);
    
    // Generate images if requested
    if (includeImages) {
      const imagePrompt = `Create an educational illustration for a quiz about ${topic}. Make it colorful, engaging, and suitable for learning. The image should be informative and visually appealing.`;
      const filename = `quiz_${topic.replace(/\s+/g, '_')}_${Date.now()}.png`;
      const imagePath = await generateAndSaveImage(imagePrompt, filename);
      
      if (imagePath) {
        quizData.image = imagePath;
      }
    }

    res.json(quizData);
  } catch (err) {
    console.error("Generate Quiz Error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// Generate Notes
app.post("/api/generate-notes", validateNotesInput, async (req, res) => {
  const { topic, gradeLevel, includeImages = false } = req.body;

  try {
    const prompt = `
Create educational notes on the topic "${topic}" for grade level "${gradeLevel}".
Make the content appropriate for the specified grade level.
Include key concepts, definitions, and examples.
Return only a JSON object like this:

{
  "title": "Notes: ${topic}",
  "gradeLevel": "${gradeLevel}",
  "sections": [
    {
      "heading": "Introduction",
      "content": "Detailed explanation...",
      "keyPoints": ["point1", "point2", "point3"]
    },
    {
      "heading": "Key Concepts",
      "content": "Detailed explanation...",
      "keyPoints": ["concept1", "concept2"]
    }
  ],
  "summary": "Brief summary of the topic"
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = cleanGeminiResponse(responseText);

    const notesData = JSON.parse(responseText);
    
    // Generate images if requested
    if (includeImages) {
      const imagePrompt = `Create an educational diagram or illustration for study notes about ${topic} for grade level ${gradeLevel}. Make it clear, informative, and age-appropriate. Include visual elements that help explain the concept.`;
      const filename = `notes_${topic.replace(/\s+/g, '_')}_${Date.now()}.png`;
      const imagePath = await generateAndSaveImage(imagePrompt, filename);
      
      if (imagePath) {
        notesData.image = imagePath;
      }
    }

    res.json(notesData);
  } catch (err) {
    console.error("Generate Notes Error:", err);
    res.status(500).json({ error: "Failed to generate notes" });
  }
});

// Generate Flashcards
app.post("/api/generate-flashcards", async (req, res) => {
  const { topic, includeImages = false } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return res.status(400).json({ error: "Topic is required and must be a non-empty string" });
  }

  try {
    const prompt = `
Create flashcards on the topic "${topic}".
Generate 10-15 flashcards with questions and answers for study purposes.
Return only a JSON object like this:

{
  "title": "Flashcards: ${topic}",
  "cards": [
    {
      "id": 1,
      "front": "Question or term",
      "back": "Answer or definition",
      "difficulty": "easy"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = cleanGeminiResponse(responseText);

    const flashcardsData = JSON.parse(responseText);
    
    // Generate images for flashcards if requested
    if (includeImages) {
      const imagePrompt = `Create a colorful, educational illustration for flashcards about ${topic}. Make it visually appealing and helpful for memorization. Include relevant symbols, diagrams, or icons related to ${topic}.`;
      const filename = `flashcards_${topic.replace(/\s+/g, '_')}_${Date.now()}.png`;
      const imagePath = await generateAndSaveImage(imagePrompt, filename);
      
      if (imagePath) {
        flashcardsData.image = imagePath;
        
        // Optionally add individual images to some cards
        for (let i = 0; i < Math.min(3, flashcardsData.cards.length); i++) {
          const cardImagePrompt = `Create a simple illustration for the flashcard about "${flashcardsData.cards[i].front}" related to ${topic}. Make it clear and educational.`;
          const cardFilename = `flashcard_${i}_${topic.replace(/\s+/g, '_')}_${Date.now()}.png`;
          const cardImagePath = await generateAndSaveImage(cardImagePrompt, cardFilename);
          if (cardImagePath) {
            flashcardsData.cards[i].image = cardImagePath;
          }
        }
      }
    }

    res.json(flashcardsData);
  } catch (err) {
    console.error("Generate Flashcards Error:", err);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

// Generate Assignment
app.post("/api/generate-assignment", validateNotesInput, async (req, res) => {
  const { topic, gradeLevel } = req.body;

  try {
    const prompt = `
Create an assignment on the topic "${topic}" for grade level "${gradeLevel}".
Include different types of questions and tasks appropriate for the grade level.
Return only a JSON object like this:

{
  "title": "Assignment: ${topic}",
  "gradeLevel": "${gradeLevel}",
  "instructions": "Complete all sections of this assignment...",
  "estimatedTime": "30-45 minutes",
  "sections": [
    {
      "type": "multiple-choice",
      "title": "Multiple Choice Questions",
      "questions": [
        {
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "points": 2
        }
      ]
    },
    {
      "type": "short-answer",
      "title": "Short Answer Questions",
      "questions": [
        {
          "question": "Question text",
          "expectedLength": "2-3 sentences",
          "points": 5
        }
      ]
    }
  ],
  "totalPoints": 25
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = cleanGeminiResponse(responseText);

    const assignmentData = JSON.parse(responseText);
    res.json(assignmentData);
  } catch (err) {
    console.error("Generate Assignment Error:", err);
    res.status(500).json({ error: "Failed to generate assignment" });
  }
});

// Feedback Generation
app.post("/api/feedback", async (req, res) => {
  const { studentData } = req.body;

  if (!studentData || typeof studentData !== 'object') {
    return res.status(400).json({ error: "Student data is required" });
  }

  try {
    const prompt = `
Analyze the following student performance data and provide constructive feedback:
${JSON.stringify(studentData, null, 2)}

Return only a JSON object like this:

{
  "overallScore": 85,
  "strengths": ["Good understanding of concepts", "Strong analytical skills"],
  "improvements": ["Work on time management", "Review chapter 3"],
  "recommendations": [
    {
      "topic": "Mathematics",
      "action": "Practice more word problems",
      "resources": ["Khan Academy", "Textbook Ch. 5"]
    }
  ],
  "encouragement": "Great work! Keep practicing and you'll improve even more."
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = cleanGeminiResponse(responseText);

    const feedbackData = JSON.parse(responseText);
    res.json(feedbackData);
  } catch (err) {
    console.error("Generate Feedback Error:", err);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

// AI Tutor
app.post("/api/tutor", async (req, res) => {
  const { question, gradeLevel, includeImages = false } = req.body;

  console.log('🤖 Tutor request:', { question, gradeLevel, includeImages });

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: "Question is required and must be a non-empty string" });
  }

  try {
    const prompt = `
You are an AI tutor helping a student at grade level "${gradeLevel || 'general'}".
The student asked: "${question}"

Provide a helpful, educational response that explains the concept clearly with examples.
Use age-appropriate language and provide step-by-step explanations when needed.
Return only a JSON object like this:

{
  "response": "Clear explanation of the concept...",
  "examples": [
    "Example 1: Detailed example",
    "Example 2: Another example"
  ],
  "relatedTopics": ["Topic 1", "Topic 2"],
  "practiceQuestions": [
    "Practice question 1",
    "Practice question 2"
  ],
  "difficulty": "beginner"
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = cleanGeminiResponse(responseText);

    const tutorData = JSON.parse(responseText);
    
    // Generate image if requested
    if (includeImages) {
      console.log('🖼️ Attempting to generate image for tutor question:', question);
      try {
        const imagePrompt = `Create an educational illustration for the topic: "${question}". Make it clear, simple, and appropriate for ${gradeLevel || 'general'} level students. Focus on visual elements that help explain the concept.`;
        console.log('🖼️ Image prompt:', imagePrompt);
        const imagePath = await generateAndSaveImage(imagePrompt, `tutor_${Date.now()}.png`);
        console.log('🖼️ Generated tutor image path:', imagePath);
        if (imagePath) {
          tutorData.image = imagePath;
          console.log('🖼️ Added image to tutor response');
        } else {
          console.log('❌ No image path returned');
        }
      } catch (imageError) {
        console.error('❌ Image generation failed for tutor:', imageError);
        // Continue without image if generation fails
      }
    } else {
      console.log('📝 Images not requested for this tutor question');
    }
    
    console.log('📤 Sending tutor response with image:', tutorData.image ? 'YES' : 'NO');
    res.json(tutorData);
  } catch (err) {
    console.error("AI Tutor Error:", err);
    res.status(500).json({ error: "Failed to get tutor response" });
  }
});

// Generate Educational Image
app.post("/api/generate-image", async (req, res) => {
  const { prompt, topic, style = "educational" } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required and must be a non-empty string" });
  }

  try {
    const enhancedPrompt = `Create a ${style} illustration: ${prompt}. Make it colorful, clear, and suitable for learning. ${topic ? `This is related to the topic: ${topic}.` : ''}`;
    const filename = `custom_image_${Date.now()}.png`;
    const imagePath = await generateAndSaveImage(enhancedPrompt, filename);
    
    if (imagePath) {
      res.json({ 
        success: true, 
        imagePath, 
        prompt: enhancedPrompt,
        filename 
      });
    } else {
      res.status(500).json({ error: "Failed to generate image" });
    }
  } catch (err) {
    console.error("Generate Image Error:", err);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Image Enhancement/Editing
app.post("/api/enhance-image", async (req, res) => {
  const { imageData, instructions, mimeType = "image/png" } = req.body;

  if (!imageData || !instructions) {
    return res.status(400).json({ error: "Image data and instructions are required" });
  }

  try {
    const prompt = [
      { text: instructions },
      {
        inlineData: {
          mimeType: mimeType,
          data: imageData,
        },
      },
    ];

    const response = await imageAI.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const enhancedImageData = part.inlineData.data;
        const buffer = Buffer.from(enhancedImageData, "base64");
        const filename = `enhanced_image_${Date.now()}.png`;
        const filepath = path.join(imagesDir, filename);
        fs.writeFileSync(filepath, buffer);
        
        res.json({ 
          success: true, 
          imagePath: `/images/${filename}`,
          instructions,
          filename 
        });
        return;
      }
    }
    
    res.status(500).json({ error: "Failed to enhance image" });
  } catch (err) {
    console.error("Enhance Image Error:", err);
    res.status(500).json({ error: "Failed to enhance image" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Virtual School Backend running on port ${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`  POST /api/generate-quiz (with optional images)`);
  console.log(`  POST /api/generate-notes (with optional images)`);
  console.log(`  POST /api/generate-flashcards (with optional images)`);
  console.log(`  POST /api/generate-assignment`);
  console.log(`  POST /api/feedback`);
  console.log(`  POST /api/tutor`);
  console.log(`  POST /api/generate-image`);
  console.log(`  POST /api/enhance-image`);
  console.log(`  GET  /api/images/:filename (CORS-enabled image serving)`);
  console.log(`  GET  /images/* (static image serving)`);
});