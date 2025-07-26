/* routes/execute.js -------------------------------------------------- */
const express = require("express");
const axios = require("axios");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const { db } = require("../firebase/config");
require("dotenv").config();

/* Judge-0 ------------------------------------------------------------ */
const HDRS = {
  "Content-Type": "application/json",
  "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
  "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
};
const JUDGE0_URL = `https://${process.env.JUDGE0_API_HOST}/submissions`;
const languageMap = { javascript: 63, python: 71, cpp: 54 };

/* utils -------------------------------------------------------------- */
const b64 = (s = "") => Buffer.from(s, "utf8").toString("base64");
const fromB64 = (s = "") => Buffer.from(s || "", "base64").toString("utf8");

/* ------------------------------------------------------------------ */
/*  Driver builders – add more cases as you add more problems         */
/* ------------------------------------------------------------------ */
function buildDriver({ language, problem, inputLines }) {
  const fn = problem.boilerplateFunctionName; // e.g., twoSum

  /* --------------------  Two Sum  ---------------------------------- */
  if (problem.title === "Two Sum") {
    const arrStr = inputLines[0]; // "[2,7,11,15]"
    const target = inputLines[1]; // "9"

    if (language === "javascript") {
      return `
const nums   = ${arrStr};
const target = ${target};
console.log(${fn}(nums, target));
`;
    }

    if (language === "python") {
      return `
nums   = ${arrStr}
target = ${target}
print(Solution().${fn}(nums, target))
`;
    }

    if (language === "cpp") {
      // convert JS array literal -> C++ brace-init
      const cppArr = arrStr.replace("[", "{").replace("]", "}");
      return `
int main() {
    Solution sol;
    std::vector<int> nums = ${cppArr};
    int target = ${target};
    auto res = sol.${fn}(nums, target);
    std::cout << "[";
    for (size_t i = 0; i < res.size(); ++i) {
        std::cout << res[i] << (i + 1 < res.size() ? "," : "");
    }
    std::cout << "]";
    return 0;
}
`;
    }
  }

  /* fallback – no driver */
  return "";
}

/* ------------------------------------------------------------------ */
/*  POST /api/execute                                                 */
/* ------------------------------------------------------------------ */
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { code, language, input = "", problemId } = req.body;

    if (!code || !language)
      return res.status(400).json({ error: "code and language are required" });

    const language_id = languageMap[language.toLowerCase()];
    if (!language_id)
      return res.status(400).json({ error: "Unsupported language" });

    /* Build final source ------------------------------------------- */
    let finalSource = code;

    if (!input && problemId) {
      const snap = await db.collection("problems").doc(problemId).get();
      if (snap.exists) {
        const problem = snap.data();
        const firstInput = problem.testCases[0].input;
        const inputLines = firstInput.split("\n");

        const driver = buildDriver({ language, problem, inputLines });
        if (driver) {
          if (language === "cpp" && !/iostream/.test(code)) {
            finalSource =
              `#include <bits/stdc++.h>\nusing namespace std;\n` + finalSource;
          }
          finalSource += "\n" + driver;
        }
      }
    }

    /* Judge-0 request --------------------------------------------- */
    const payload = {
      source_code: b64(finalSource),
      stdin: b64(input),
      language_id,
    };

    const { data } = await axios.post(
      `${JUDGE0_URL}?base64_encoded=true&wait=true`,
      payload,
      { headers: HDRS }
    );

    res.json({
      stdout: fromB64(data.stdout),
      stderr: fromB64(data.stderr),
      compile_output: fromB64(data.compile_output),
      status: data.status,
    });
  } catch (err) {
    console.error("Run-code error:\n", err.response?.data || err.message);
    if (err.response?.status === 403) {
      return res.status(403).json({ error: "Bad Judge-0 key / host" });
    }
    return res.status(500).json({ error: "Internal execution error" });
  }
});

module.exports = router;
