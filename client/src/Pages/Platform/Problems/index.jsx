import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../Firebase/firebase";
import ProblemSidebar from "../components/ProblemSidebar";
import ProblemDetails from "../components/ProblemDetails";
import ProblemEditor from "../components/ProblemEditor";
import ActionButtons from "../components/ActionsButton";
import { getBoilerplate } from "../Constants/languageBoilerplate";

const BASE_URL = import.meta.env.VITE_URL;

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);

      if (user) {
        try {
          const token = await user.getIdToken();
          const res = await fetch(`${BASE_URL}/problems`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
          }

          const data = await res.json();
          setProblems(data);
          if (data.length > 0) {
            setSelectedProblem(data[0]);
          }
        } catch (err) {
          setError("Failed to load problems. Please try again.");
          console.error("Fetch problems error:", err);
        }
      } else {
        setError("Please log in to view problems.");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedProblem) {
      const newCode = getBoilerplate(
        language,
        selectedProblem.boilerplateFunctionName
      );
      setCode(newCode);
    }
  }, [selectedProblem, language]);

  const handleLanguageChange = (selectedLang) => {
    setLanguage(selectedLang);
    // Code will be updated by useEffect above
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    // Code will be updated by useEffect above
  };

  const handleSubmitCode = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in.");
        return;
      }

      if (!selectedProblem) {
        alert("Please select a problem first.");
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch(`${BASE_URL}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          problemId: selectedProblem?.id,
        }),
      });

      const result = await res.json();

      if (result.success) {
        const passedCount = result.testCaseResults.filter(
          (tc) => tc.passed
        ).length;
        const totalCount = result.testCaseResults.length;

        if (result.verdict === "Accepted") {
          alert(
            `✅ ${result.verdict}!\nAll test cases passed (${passedCount}/${totalCount})`
          );
        } else {
          alert(
            `❌ ${result.verdict}\nPassed: ${passedCount}/${totalCount} test cases`
          );
        }

        console.log("Test Case Results:", result.testCaseResults);
      } else {
        alert(`❌ Submission failed: ${result.error || result.message}`);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Something went wrong while submitting.");
    }
  };

  const handleRunCode = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in.");
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch(`${BASE_URL}/execute`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          problemId: selectedProblem?.id,
          input: "",
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(`Execution Error: ${data.error}`);
      } else {
        const { stdout, stderr, compile_output, status } = data;
        const output = stderr || compile_output || stdout || "No output";
        alert(`Output:\n${output}`);
      }
    } catch (err) {
      console.error("Execution failed:", err);
      alert("Something went wrong while executing.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading problems...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Problems List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <ProblemSidebar
          problems={problems}
          selectedId={selectedProblem?.id}
          onSelect={handleProblemSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Middle Panel - Problem Description */}
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
          {selectedProblem ? (
            <>
              {/* Tabs */}
              <div className="border-b border-gray-200 bg-white">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === "description"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === "submissions"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Submissions
                  </button>
                  <button
                    onClick={() => setActiveTab("editorial")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === "editorial"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Editorial
                  </button>
                  <button
                    onClick={() => setActiveTab("solutions")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === "solutions"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Solutions
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === "description" && (
                  <ProblemDetails problem={selectedProblem} />
                )}
                {activeTab === "submissions" && (
                  <div className="p-6">
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-3">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2 font-medium">
                        No submissions yet
                      </p>
                      <p className="text-gray-400 text-sm">
                        Submit your solution to see your submission history
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === "editorial" && (
                  <div className="p-6">
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-3">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2 font-medium">
                        Editorial not available
                      </p>
                      <p className="text-gray-400 text-sm">
                        Official editorial will be published soon
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === "solutions" && (
                  <div className="p-6">
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-3">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2 font-medium">
                        Community solutions
                      </p>
                      <p className="text-gray-400 text-sm">
                        View solutions shared by the community
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 mb-3">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  Select a problem to view details
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Choose from the problems list on the left
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Editor Header */}
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Language:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                {selectedProblem && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{selectedProblem.title}</span>
                  </div>
                )}
              </div>

              <ActionButtons
                onRun={handleRunCode}
                onSubmit={handleSubmitCode}
                disabled={!selectedProblem}
              />
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            {selectedProblem ? (
              <ProblemEditor
                code={code}
                setCode={setCode}
                language={language}
                readOnly={false}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-gray-400 mb-3">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    Select a problem to start coding
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    The editor will load with the appropriate boilerplate code
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Editor Footer - Optional status bar */}
          {selectedProblem && (
            <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-600">
              <div className="flex justify-between items-center">
                <div className="space-x-4">
                  <span>
                    Function:{" "}
                    <code className="bg-gray-200 px-1 rounded">
                      {selectedProblem.boilerplateFunctionName}
                    </code>
                  </span>
                  <span>
                    Difficulty:{" "}
                    <span
                      className={`font-medium ${
                        selectedProblem.difficulty === "easy"
                          ? "text-green-600"
                          : selectedProblem.difficulty === "medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedProblem.difficulty}
                    </span>
                  </span>
                </div>
                <div className="space-x-4">
                  <span>Time: {selectedProblem.timeComplexity || "N/A"}</span>
                  <span>Space: {selectedProblem.spaceComplexity || "N/A"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
