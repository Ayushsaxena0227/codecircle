const { db } = require("../firebase/config");

exports.saveSubmission = async (req, res) => {
  const { problemId, code, language, input, output, expectedOutput } = req.body;
  const userId = req.user.uid;

  if (!problemId || !code || !language || !output || !expectedOutput) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const verdict = output.trim() === expectedOutput.trim() ? "Passed" : "Failed";

  try {
    await db.collection("users").doc(userId).collection("submissions").add({
      problemId,
      code,
      language,
      input,
      output,
      expectedOutput,
      verdict,
      timestamp: new Date(),
    });

    res.status(200).json({ message: "Submission saved", verdict });
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ error: "Failed to save submission" });
  }
};
