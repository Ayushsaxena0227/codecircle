import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../Firebase/firebase";
import ProblemSidebar from "../components/ProblemSidebar";
import ProblemDetails from "../components/ProblemDetails";
import ProblemEditor from "../components/ProblemEditor";
import ActionButtons from "../components/ActionsButton";
import { getBoilerplate } from "../Constants/languageBoilerplate";
import toast, { Toaster } from "react-hot-toast";
import "@fontsource/lexend";
import SubmissionsTab from "../components/SubmissionTab";

const BASE_URL = import.meta.env.VITE_URL;

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ------------------------------------------------------------------ */
  /* fetch problems after login                                         */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);

      if (!user) {
        setError("Please log in to view problems.");
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch(`${BASE_URL}/problems`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProblems(data);
        if (data.length) setSelectedProblem(data[0]);
      } catch {
        setError("Failed to load problems. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* ------------------------------------------------------------------ */
  /* load boiler-plate when problem/language changes                    */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (selectedProblem) {
      const boiler = getBoilerplate(
        language,
        selectedProblem.boilerplateFunctionName
      );
      setCode(boiler);
    }
  }, [selectedProblem, language]);

  /* ------------------------------------------------------------------ */
  /* RUN                                                                */
  /* ------------------------------------------------------------------ */
  const handleRunCode = async () => {
    if (isRunning || isSubmitting || !selectedProblem) return;
    setIsRunning(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in.");
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
          problemId: selectedProblem.id,
          input: "",
        }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(`Execution error: ${data.error}`);
      } else {
        const { stdout, stderr, compile_output } = data;
        const output = stderr || compile_output || stdout || "No output";
        toast.success(output, { duration: 6000 });
      }
    } catch {
      toast.error("Something went wrong while executing.");
    } finally {
      setIsRunning(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* SUBMIT                                                             */
  /* ------------------------------------------------------------------ */
  const handleSubmitCode = async () => {
    if (isRunning || isSubmitting || !selectedProblem) return;
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in.");
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
          problemId: selectedProblem.id,
        }),
      });

      const result = await res.json();
      if (result.success) {
        const passed = result.testCaseResults.filter((t) => t.passed).length;
        const total = result.testCaseResults.length;
        if (result.verdict === "Accepted") {
          toast.success(`Accepted! All ${total} tests`);
        } else {
          toast.error(`${result.verdict}. Passed ${passed}/${total}`);
        }
      } else {
        toast.error(result.error || result.message || "Submission failed");
      }
    } catch {
      toast.error("Something went wrong while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* loading / error states                                             */
  /* ------------------------------------------------------------------ */
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );

  /* ------------------------------------------------------------------ */
  /* main UI                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-gray-50 font-lexend">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <ProblemSidebar
            problems={problems}
            selectedId={selectedProblem?.id}
            onSelect={setSelectedProblem}
          />
        </div>

        {/* Main 2-panel area */}
        <div className="flex-1 flex">
          {/* --------------- DESCRIPTION PANEL --------------- */}
          <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
            {selectedProblem ? (
              <>
                <div className="border-b border-gray-200 bg-white">
                  <div className="flex">
                    {[
                      "description",
                      "submissions",
                      "editorial",
                      "solutions",
                    ].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {activeTab === "description" && (
                    <ProblemDetails problem={selectedProblem} />
                  )}
                  {activeTab === "submissions" && (
                    <SubmissionsTab problemId={selectedProblem.id} />
                  )}
                  {activeTab === "editorial" && (
                    <div className="p-6 text-center text-gray-400">
                      Editorial not available
                    </div>
                  )}
                  {activeTab === "solutions" && (
                    <div className="p-6 text-center text-gray-400">
                      Community solutions coming soon
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a problem to view details
              </div>
            )}
          </div>

          {/* --------------- EDITOR PANEL --------------- */}
          <div className="w-1/2 bg-white flex flex-col">
            {/* header */}
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Language:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                <ActionButtons
                  onRun={handleRunCode}
                  onSubmit={handleSubmitCode}
                  disabled={!selectedProblem}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>

            {/* editor */}
            <div className="flex-1">
              {selectedProblem ? (
                <ProblemEditor
                  code={code}
                  setCode={setCode}
                  language={language}
                  loading={isRunning || isSubmitting}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
                  Select a problem to start coding
                </div>
              )}
            </div>

            {/* footer */}
            {selectedProblem && (
              <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-600 flex justify-between">
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
                  <span>Time: {selectedProblem.timeComplexity}</span>
                  <span>Space: {selectedProblem.spaceComplexity}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
