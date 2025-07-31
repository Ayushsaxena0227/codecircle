// controllers/submissionController.js
const { db } = require("../firebase/config");
const axios = require("axios");
const EnhancedCodeGenerator = require("../utils/enhancedCodeGenerator");
const TypeSystem = require("../utils/typeSystem");

// Language ID mapping for Judge0
const getLanguageId = (language) => {
  const map = {
    cpp: 54,
    python: 71,
    javascript: 63,
    java: 62,
    c: 50,
  };
  return map[language] || 54;
};

// Base64 encode/decode functions
const base64Encode = (str) => Buffer.from(str, "utf8").toString("base64");
const base64Decode = (str) => Buffer.from(str, "base64").toString("utf8");

exports.saveSubmission = async (req, res) => {
  const { problemId, code, language } = req.body;
  const userId = req.user.uid;

  if (!problemId || !code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("⏳ Fetching problem from Firestore...");
    const problemRef = db.collection("problems").doc(problemId);
    const problemDoc = await problemRef.get();

    if (!problemDoc.exists) {
      console.error("❌ Problem not found");
      return res.status(404).json({ error: "Problem not found" });
    }

    const problem = problemDoc.data();
    const { testCases, title } = problem;

    console.log("✅ Found problem. Starting test case evaluation...");

    // Run all test cases
    const testResults = await runTestCases(code, language, problem, testCases);

    // Determine final verdict
    const verdict = determineVerdict(testResults);

    // Save submission to database
    await saveSubmissionToDb(
      userId,
      problemId,
      title,
      problem,
      code,
      language,
      verdict,
      testResults
    );

    return res.status(200).json({
      success: true,
      message: `Submission ${verdict}`,
      verdict,
      testCaseResults: testResults,
    });
  } catch (err) {
    console.error("🔥 Submission error:", err.message);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// Run all test cases for a submission
async function runTestCases(code, language, problem, testCases) {
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    let testCase = testCases[i];

    // 🔧 PARSE STRING INPUTS TO OBJECTS
    if (typeof testCase.input === "string") {
      try {
        testCase.input = JSON.parse(testCase.input);
      } catch (e) {
        console.error("❌ Failed to parse input:", testCase.input);
      }
    }

    if (typeof testCase.output === "string") {
      try {
        testCase.output = JSON.parse(testCase.output);
      } catch (e) {
        console.error("❌ Failed to parse output:", testCase.output);
      }
    }

    console.log(`🔁 Running test case ${i + 1}:`, testCase.input);

    try {
      console.log("🔍 Problem structure:", {
        functionName: problem.functionName,
        parameters: problem.parameters,
        returnType: problem.returnType,
        title: problem.title,
      });
      console.log("🔍 Test case input:", testCase.input);
      console.log("🔍 Language:", language);
      const testCode = EnhancedCodeGenerator.generateTestCode(
        code,
        language,
        problem,
        testCase
      );
      const judgeResult = await submitToJudge0(testCode, language);
      const result = processJudgeResult(judgeResult, testCase, problem);
      results.push(result);
    } catch (error) {
      console.error(`❌ Error in test case ${i + 1}:`, error.message);
      results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        userOutput: `System Error: ${error.message}`,
        passed: false,
        error: true,
        errorType: "System Error",
        explanation: testCase.explanation,
      });
    }
  }

  return results;
}

// Run a single test case
async function runSingleTestCase(code, language, problem, testCase) {
  // Generate test wrapper code
  const testCode = CodeGenerator.generateTestCode(
    code,
    language,
    problem,
    testCase
  );

  // Submit to Judge0
  const judgeResult = await submitToJudge0(testCode, language);

  // Process the result
  return processJudgeResult(judgeResult, testCase, problem);
}

// Submit code to Judge0 API
async function submitToJudge0(code, language) {
  const encodedCode = base64Encode(code);

  const response = await axios.post(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
    {
      source_code: encodedCode,
      language_id: getLanguageId(language),
      stdin: "",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
      },
      timeout: 10000,
    }
  );

  return response.data;
}
// Process Judge0 result and compare with expected output
function processJudgeResult(judgeResult, testCase, problem) {
  const stdout = judgeResult.stdout
    ? base64Decode(judgeResult.stdout).trim()
    : "";
  const stderr = judgeResult.stderr
    ? base64Decode(judgeResult.stderr).trim()
    : "";
  const compileOutput = judgeResult.compile_output
    ? base64Decode(judgeResult.compile_output).trim()
    : "";

  // Handle errors
  if (compileOutput) {
    return {
      input: testCase.input,
      expectedOutput: testCase.output,
      userOutput: `Compilation Error: ${compileOutput}`,
      passed: false,
      error: true,
      errorType: "Compilation Error",
      explanation: testCase.explanation,
    };
  }

  if (stderr) {
    return {
      input: testCase.input,
      expectedOutput: testCase.output,
      userOutput: `Runtime Error: ${stderr}`,
      passed: false,
      error: true,
      errorType: "Runtime Error",
      explanation: testCase.explanation,
    };
  }

  if (judgeResult.status?.id !== 3) {
    const statusDescription =
      judgeResult.status?.description || "Unknown Error";
    return {
      input: testCase.input,
      expectedOutput: testCase.output,
      userOutput: `${statusDescription}${stdout ? `: ${stdout}` : ""}`,
      passed: false,
      error: true,
      errorType: statusDescription,
      explanation: testCase.explanation,
    };
  }

  // ✅ NEW: Better output comparison
  const userOutput = stdout;
  const expectedOutput = testCase.output;
  const passed = compareOutputs(userOutput, expectedOutput, problem.returnType);

  return {
    input: testCase.input,
    expectedOutput: expectedOutput,
    userOutput: userOutput,
    passed,
    explanation: testCase.explanation,
  };
}

// Normalize output for comparison
function normalizeOutput(output, returnType) {
  if (typeof output === "object") return output;

  try {
    return TypeSystem.deserializeOutput(output, returnType, "universal");
  } catch (error) {
    return output.toString().trim();
  }
}

// Compare two outputs considering type and format differences
function compareOutputs(userOutput, expectedOutput, returnType) {
  // Try exact match first
  if (userOutput === String(expectedOutput)) return true;

  try {
    // For arrays/objects, try JSON comparison
    if (
      returnType &&
      (returnType.includes("vector") ||
        returnType.includes("List") ||
        returnType.includes("[]"))
    ) {
      const normalizedUser = JSON.parse(userOutput.replace(/'/g, '"'));
      const normalizedExpected = expectedOutput;
      return (
        JSON.stringify(normalizedUser) === JSON.stringify(normalizedExpected)
      );
    }

    // For numbers
    if (
      returnType &&
      (returnType === "int" ||
        returnType === "double" ||
        returnType === "float")
    ) {
      return parseFloat(userOutput) === parseFloat(expectedOutput);
    }

    // For booleans
    if (returnType && (returnType === "bool" || returnType === "boolean")) {
      const userBool =
        userOutput.toLowerCase() === "true" || userOutput === "1";
      const expectedBool = expectedOutput === true || expectedOutput === "true";
      return userBool === expectedBool;
    }
  } catch (error) {
    // Fall back to string comparison
  }

  return userOutput.trim() === String(expectedOutput).trim();
}
// Determine final verdict based on all test results
function determineVerdict(testResults) {
  const hasErrors = testResults.some((result) => result.error);
  const allPassed = testResults.every((result) => result.passed);

  if (hasErrors) {
    const hasCompilationError = testResults.some(
      (result) => result.errorType === "Compilation Error"
    );
    const hasRuntimeError = testResults.some(
      (result) => result.errorType === "Runtime Error"
    );
    const hasTimeLimit = testResults.some(
      (result) => result.errorType === "Time Limit Exceeded"
    );

    if (hasCompilationError) return "Compilation Error";
    if (hasRuntimeError) return "Runtime Error";
    if (hasTimeLimit) return "Time Limit Exceeded";
    return "Error";
  }

  return allPassed ? "Accepted" : "Wrong Answer";
}
// Save submission to database
async function saveSubmissionToDb(
  userId,
  problemId,
  problemTitle,
  problem,
  code,
  language,
  verdict,
  testResults
) {
  await db
    .collection("users")
    .doc(userId)
    .collection("submissions")
    .add({
      problemId,
      problemTitle,
      problemDifficulty: (problem.difficulty || "").toLowerCase(),
      code,
      language,
      verdict,
      testCaseResults: testResults,
      timestamp: new Date(),
      passedTests: testResults.filter((r) => r.passed).length,
      totalTests: testResults.length,
    });
}
exports.getSubmissions = async (req, res) => {
  try {
    const userId = req.user.uid;
    const problemId = req.params.problemId;

    const col = db.collection("users").doc(userId).collection("submissions");

    const snap = problemId
      ? await col
          .where("problemId", "==", problemId)
          .orderBy("timestamp", "desc")
          .get()
      : await col.orderBy("timestamp", "desc").get();

    const submissions = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toMillis(),
      };
    });

    return res.json({ submissions });
  } catch (err) {
    console.error("Get submissions error:", err.message);
    return res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

// // Helper functions for metadata
// function calculateAverageTime(testResults) {
//   // This would be implemented if Judge0 returns timing info
//   return null;
// }

// function calculateAverageMemory(testResults) {
//   // This would be implemented if Judge0 returns memory info
//   return null;
// }
