import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../Firebase/firebase";
import ProblemSidebar from "../components/ProblemSidebar";
import ProblemDetails from "../components/ProblemDetails";
import ProblemEditor from "../components/ProblemEditor";
import ActionButtons from "../components/ActionsButton";
import { boilerplates } from "../Constants/languageBoilerplate";

const BASE_URL = import.meta.env.VITE_URL;

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(boilerplates["javascript"]);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔐 Auth listener & Fetch problems
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

  // 🔄 Update boilerplate when language changes
  const handleLanguageChange = (selectedLang) => {
    setLanguage(selectedLang);
    setCode(boilerplates[selectedLang]);
  };

  // ▶️ Handle Run Code (your original working logic)
  const handleRunCode = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in.");
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch(`${BASE_URL}/api/execute`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          input: "",
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(`Execution Error: ${data.error}`);
      } else {
        const { stdout, stderr, compile_output, status } = data;
        alert(stderr || compile_output || stdout || "No output");
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
          onSelect={setSelectedProblem}
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
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === "submissions"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Submissions
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
                    <p className="text-gray-500">
                      Submission history will be available in Phase 10.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a problem to view details</p>
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Editor Header */}
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <ActionButtons onRun={handleRunCode} />
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <ProblemEditor code={code} setCode={setCode} language={language} />
          </div>
        </div>
      </div>
    </div>
  );
}
