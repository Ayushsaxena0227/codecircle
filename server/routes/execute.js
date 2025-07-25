const express = require("express");
const axios = require("axios");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
require("dotenv").config();

// Dynamically load headers from .env
const JUDGE0_HEADERS = {
  "content-type": "application/json",
  "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
  "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
};

const JUDGE0_URL = `https://${process.env.JUDGE0_API_HOST}/submissions`;

const languageMap = {
  javascript: 63,
  python: 71,
  cpp: 54,
};

router.post("/", authenticateUser, async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  const language_id = languageMap[language.toLowerCase()];
  if (!language_id) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    const submissionRes = await axios.post(
      `${JUDGE0_URL}?base64_encoded=false&wait=true`,
      {
        source_code: code,
        stdin: input || "",
        language_id,
      },
      { headers: JUDGE0_HEADERS }
    );

    const { stdout, stderr, compile_output, status } = submissionRes.data;

    res.json({
      stdout,
      stderr,
      compile_output,
      status,
    });
  } catch (err) {
    console.error("Execution error:", err.response?.data || err.message);

    // Judge0 returns 403 for invalid API key
    if (err.response?.status === 403) {
      return res
        .status(403)
        .json({ error: "Invalid Judge0 API Key or Host in .env file" });
    }

    res.status(500).json({ error: "Execution failed" });
  }
});

module.exports = router;
