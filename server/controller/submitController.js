const { db } = require("../firebase/config");
const axios = require("axios");

// Language ID mapping for Judge0
function getLanguageId(language) {
  const map = {
    cpp: 54,
    python: 71,
    javascript: 63,
    java: 62,
    c: 50,
  };
  return map[language] || 54;
}

// Base64 encode function
function base64Encode(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

// Base64 decode function
function base64Decode(str) {
  return Buffer.from(str, "base64").toString("utf8");
}

// Generate test wrapper code for different languages
const generateTestCode = (userCode, language, problem, testCase) => {
  const { boilerplateFunctionName: functionName } = problem;
  const input = testCase.input;

  if (language === "cpp") {
    return generateCppTestCode(userCode, functionName, input);
  } else if (language === "python") {
    return generatePythonTestCode(userCode, functionName, input);
  } else if (language === "javascript") {
    return generateJavaScriptTestCode(userCode, functionName, input);
  }

  return userCode; // fallback
};

// Updated C++ code generation functions for your submission handler

const generateCppTestCode = (userCode, functionName, input) => {
  const lines = input.trim().split("\n");

  if (functionName === "twoSum") {
    const nums = lines[0]; // "[2,7,11,15]"
    const target = lines[1]; // "9"

    return `#include <iostream>
#include <vector>
#include <sstream>
#include <string>
using namespace std;

${userCode}

vector<int> parseArray(string str) {
    vector<int> result;
    if (str.empty() || str == "[]") return result;
    
    // Remove brackets
    str = str.substr(1, str.length() - 2);
    
    if (str.empty()) return result;
    
    stringstream ss(str);
    string item;
    while (getline(ss, item, ',')) {
        result.push_back(stoi(item));
    }
    return result;
}

int main() {
    try {
        vector<int> nums = parseArray("${nums}");
        int target = ${target};
        
        Solution sol;
        vector<int> result = sol.${functionName}(nums, target);
        
        cout << "[";
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) cout << ",";
            cout << result[i];
        }
        cout << "]";
    } catch (const exception& e) {
        cout << "Error: " << e.what();
    }
    
    return 0;
}`;
  }

  if (functionName === "isPalindrome") {
    const s = lines[0].replace(/"/g, ""); // Remove quotes if present

    return `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

${userCode}

int main() {
    try {
        string s = "${s}";
        
        Solution sol;
        bool result = sol.${functionName}(s);
        
        cout << (result ? "true" : "false");
    } catch (const exception& e) {
        cout << "Error: " << e.what();
    }
    
    return 0;
}`;
  }

  if (functionName === "reverseInteger") {
    const x = lines[0];

    return `#include <iostream>
#include <climits>
using namespace std;

${userCode}

int main() {
    try {
        int x = ${x};
        
        Solution sol;
        int result = sol.${functionName}(x);
        
        cout << result;
    } catch (const exception& e) {
        cout << "Error: " << e.what();
    }
    
    return 0;
}`;
  }

  if (functionName === "factorial") {
    const n = lines[0];

    return `#include <iostream>
using namespace std;

${userCode}

int main() {
    try {
        int n = ${n};
        
        Solution sol;
        int result = sol.${functionName}(n);
        
        cout << result;
    } catch (const exception& e) {
        cout << "Error: " << e.what();
    }
    
    return 0;
}`;
  }

  if (functionName === "transpose") {
    const matrix = lines[0]; // "[[1,2,3],[4,5,6]]"

    return `#include <iostream>
#include <vector>
#include <sstream>
#include <string>
using namespace std;

${userCode}

vector<vector<int>> parseMatrix(string str) {
    vector<vector<int>> result;
    if (str.empty() || str == "[]") return result;
    
    // Remove outer brackets
    str = str.substr(1, str.length() - 2);
    
    string row = "";
    int bracketCount = 0;
    
    for (int i = 0; i < str.length(); i++) {
        if (str[i] == '[') {
            bracketCount++;
            if (bracketCount == 1) continue;
        } else if (str[i] == ']') {
            bracketCount--;
            if (bracketCount == 0) {
                // Parse the row
                vector<int> currentRow;
                if (!row.empty()) {
                    stringstream ss(row);
                    string item;
                    while (getline(ss, item, ',')) {
                        currentRow.push_back(stoi(item));
                    }
                }
                result.push_back(currentRow);
                row = "";
                continue;
            }
        }
        
        if (bracketCount > 0 && str[i] != '[' && str[i] != ']') {
            row += str[i];
        }
    }
    
    return result;
}

int main() {
    try {
        vector<vector<int>> matrix = parseMatrix("${matrix}");
        
        Solution sol;
        vector<vector<int>> result = sol.${functionName}(matrix);
        
        cout << "[";
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) cout << ",";
            cout << "[";
            for (int j = 0; j < result[i].size(); j++) {
                if (j > 0) cout << ",";
                cout << result[i][j];
            }
            cout << "]";
        }
        cout << "]";
    } catch (const exception& e) {
        cout << "Error: " << e.what();
    }
    
    return 0;
}`;
  }

  return userCode;
};

const generatePythonTestCode = (userCode, functionName, input) => {
  const lines = input.trim().split("\n");

  if (functionName === "twoSum") {
    const nums = lines[0];
    const target = lines[1];

    return `${userCode}

import json

try:
    nums = ${nums}
    target = ${target}

    sol = Solution()
    result = sol.${functionName}(nums, target)
    print(json.dumps(result))
except Exception as e:
    print(f"Error: {e}")`;
  }

  if (functionName === "isPalindrome") {
    const s = lines[0].replace(/"/g, "");

    return `${userCode}

try:
    s = "${s}"

    sol = Solution()
    result = sol.${functionName}(s)
    print("true" if result else "false")
except Exception as e:
    print(f"Error: {e}")`;
  }

  if (functionName === "reverseInteger") {
    const x = lines[0];

    return `${userCode}

try:
    x = ${x}

    sol = Solution()
    result = sol.${functionName}(x)
    print(result)
except Exception as e:
    print(f"Error: {e}")`;
  }

  if (functionName === "factorial") {
    const n = lines[0];

    return `${userCode}

try:
    n = ${n}

    sol = Solution()
    result = sol.${functionName}(n)
    print(result)
except Exception as e:
    print(f"Error: {e}")`;
  }

  if (functionName === "transpose") {
    const matrix = lines[0];

    return `${userCode}

import json

try:
    matrix = ${matrix}

    sol = Solution()
    result = sol.${functionName}(matrix)
    print(json.dumps(result))
except Exception as e:
    print(f"Error: {e}")`;
  }

  return userCode;
};

const generateJavaScriptTestCode = (userCode, functionName, input) => {
  const lines = input.trim().split("\n");

  if (functionName === "twoSum") {
    const nums = lines[0];
    const target = lines[1];

    return `${userCode}

try {
    const nums = ${nums};
    const target = ${target};

    const result = ${functionName}(nums, target);
    console.log(JSON.stringify(result));
} catch (error) {
    console.log("Error: " + error.message);
}`;
  }

  if (functionName === "isPalindrome") {
    const s = lines[0].replace(/"/g, "");

    return `${userCode}

try {
    const s = "${s}";

    const result = ${functionName}(s);
    console.log(result ? "true" : "false");
} catch (error) {
    console.log("Error: " + error.message);
}`;
  }

  if (functionName === "reverseInteger") {
    const x = lines[0];

    return `${userCode}

try {
    const x = ${x};

    const result = ${functionName}(x);
    console.log(result);
} catch (error) {
    console.log("Error: " + error.message);
}`;
  }

  if (functionName === "factorial") {
    const n = lines[0];

    return `${userCode}

try {
    const n = ${n};

    const result = ${functionName}(n);
    console.log(result);
} catch (error) {
    console.log("Error: " + error.message);
}`;
  }

  if (functionName === "transpose") {
    const matrix = lines[0];

    return `${userCode}

try {
    const matrix = ${matrix};

    const result = ${functionName}(matrix);
    console.log(JSON.stringify(result));
} catch (error) {
    console.log("Error: " + error.message);
}`;
  }

  return userCode;
};
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
    let allPassed = true;
    const testCaseResults = [];

    console.log("✅ Found problem. Starting test case evaluation...");

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`🔁 Running test case ${i + 1}:`, testCase.input);

      try {
        // Generate test code with proper wrapper
        const testCode = generateTestCode(code, language, problem, testCase);

        // Encode the source code in base64
        const encodedCode = base64Encode(testCode);

        const submissionRes = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
          {
            source_code: encodedCode,
            language_id: getLanguageId(language),
            stdin: "", // No stdin needed as we embed input in code
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            },
            timeout: 10000, // 10 second timeout
          }
        );

        const judgeResult = submissionRes.data;

        // Decode base64 responses
        const stdout = judgeResult.stdout
          ? base64Decode(judgeResult.stdout).trim()
          : "";
        const stderr = judgeResult.stderr
          ? base64Decode(judgeResult.stderr).trim()
          : "";
        const compile_output = judgeResult.compile_output
          ? base64Decode(judgeResult.compile_output).trim()
          : "";

        console.log(`📊 Test case ${i + 1} result:`, {
          status: judgeResult.status?.description,
          stdout: stdout.substring(0, 100) + (stdout.length > 100 ? "..." : ""),
          stderr: stderr.substring(0, 100) + (stderr.length > 100 ? "..." : ""),
        });

        // Handle compilation errors
        if (compile_output) {
          testCaseResults.push({
            input: testCase.input,
            expectedOutput: testCase.output,
            userOutput: `Compilation Error: ${compile_output}`,
            passed: false,
            error: true,
            errorType: "Compilation Error",
          });
          allPassed = false;
          continue;
        }

        // Handle runtime errors
        if (stderr) {
          testCaseResults.push({
            input: testCase.input,
            expectedOutput: testCase.output,
            userOutput: `Runtime Error: ${stderr}`,
            passed: false,
            error: true,
            errorType: "Runtime Error",
          });
          allPassed = false;
          continue;
        }

        // Handle time limit exceeded or other status errors
        if (judgeResult.status?.id !== 3) {
          // 3 = Accepted
          const statusDescription =
            judgeResult.status?.description || "Unknown Error";
          testCaseResults.push({
            input: testCase.input,
            expectedOutput: testCase.output,
            userOutput: `${statusDescription}${stdout ? `: ${stdout}` : ""}`,
            passed: false,
            error: true,
            errorType: statusDescription,
          });
          allPassed = false;
          continue;
        }

        // Compare output
        const userOutput = stdout;
        const expectedOutput = testCase.output.trim();
        const passed = userOutput === expectedOutput;

        if (!passed) allPassed = false;

        testCaseResults.push({
          input: testCase.input,
          expectedOutput: expectedOutput,
          userOutput: userOutput,
          passed,
          explanation: testCase.explanation,
        });
      } catch (axiosError) {
        console.error(`❌ Error in test case ${i + 1}:`, axiosError.message);
        testCaseResults.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          userOutput: `System Error: ${axiosError.message}`,
          passed: false,
          error: true,
          errorType: "System Error",
        });
        allPassed = false;
      }
    }

    const verdict = allPassed ? "Accepted" : "Wrong Answer";

    // Check if there were any compilation or runtime errors
    const hasErrors = testCaseResults.some((result) => result.error);
    const finalVerdict = hasErrors ? "Error" : verdict;

    // Save submission to user's collection

    await db
      .collection("users")
      .doc(userId)
      .collection("submissions")
      .add({
        problemId,
        problemTitle: title,
        problemDifficulty: (problem.difficulty || "").toLowerCase(),
        code,
        language,
        verdict: finalVerdict,
        testCaseResults,
        timestamp: new Date(),
      });

    return res.status(200).json({
      success: true,
      message: `Submission ${finalVerdict}`,
      verdict: finalVerdict,
      testCaseResults,
    });
  } catch (err) {
    console.error("🔥 Submission error:", err.message);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};
