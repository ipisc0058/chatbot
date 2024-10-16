require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

const cors = require('cors');
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST route to generate content
app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt; // Get the prompt from the request body

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "An error occurred while generating content." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});
