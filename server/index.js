const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { userInput } = req.body;

  const prompt = `
You are PhobiaBreaker — an AI that helps students overcome the fear of building projects.
A student has this idea: "${userInput}"

Respond ONLY in this exact JSON format, no extra text:
{
  "fearScore": <number 1-10 how ambitious this idea is>,
  "fearMessage": "<one line about the fear score>",
  "mvpPlan": "<4-5 step by step actions to build this in 3 hours>",
  "techStack": "<best tech stack with one line reason for each>",
  "similarStartup": "<name a similar startup and explain the market gap>",
  "roast": "<roast the student for not building this sooner, then motivate them>",
  "pitchScript": "<a confident 2-minute pitch script for judges>"
}
  `;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const parsed = JSON.parse(response.data.choices[0].message.content);
    res.json(parsed);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
