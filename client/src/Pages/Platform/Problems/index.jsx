import { useEffect, useState } from "react";
import React from "react";
import { auth } from "../../../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ProblemEditor from "../components/ProblemEditor";
import { boilerplates } from "../Constants/languageBoilerplate";

const BASE_URL = import.meta.env.VITE_URL;

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(boilerplates["javascript"]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);

      if (user) {
        try {
          const token = await user.getIdToken();
          const res = await fetch(`${BASE_URL}/api/problems`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
          }

          const data = await res.json();
          setProblems(data);
          if (data.length > 0) setSelectedProblem(data[0]);
        } catch (err) {
          setError("Failed to load problems. Please try again.");
        }
      } else {
        setError("Please log in to view problems.");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRunCode = () => {
    console.log("Running code:", code);
    alert("Code run placeholder - will connect to Judge0 in next phase!");
  };

  const handleSubmit = () => {
    console.log("Submitting code:", code);
    alert("Submission placeholder - will validate + store in next phase!");
  };
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(boilerplates[selectedLang]); // load new boilerplate
  };

  if (loading) {
    return <div className="p-4 text-center">Loading problems...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left Side: Problems List */}
      <div className="w-1/4 bg-gray-100 border-r border-gray-300 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Problems</h1>
        <ul className="space-y-2">
          {problems.map((prob) => (
            <li
              key={prob.id}
              onClick={() => setSelectedProblem(prob)}
              className={`p-3 rounded cursor-pointer hover:bg-gray-200 ${
                selectedProblem?.id === prob.id ? "bg-gray-300" : ""
              }`}
            >
              <h2 className="font-semibold">{prob.title}</h2>
              <p className="text-sm text-gray-600">{prob.difficulty}</p>
              <div className="text-xs text-blue-500">
                Tags: {prob.tags?.join(", ") || "None"}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side: Problem Details + Editor */}
      <div className="w-3/4 flex flex-col h-screen">
        {selectedProblem ? (
          <>
            {/* Problem Details - Fixed height */}
            <div className="h-1/2 p-4 border-b border-gray-300 overflow-y-auto bg-white">
              <h1 className="text-2xl font-bold mb-2">
                {selectedProblem.title}
              </h1>
              <p className="text-sm text-gray-600 mb-2">
                Difficulty: {selectedProblem.difficulty}
              </p>
              <p className="mb-4">{selectedProblem.description}</p>
              <div className="text-xs text-blue-500 mb-4">
                Tags: {selectedProblem.tags?.join(", ") || "None"}
              </div>
              <h3 className="font-semibold mb-2">Test Cases / Examples</h3>
              {selectedProblem.testCases?.map((test, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-100 rounded">
                  <p>
                    <strong>Input:</strong> {test.input}
                  </p>
                  <p>
                    <strong>Output:</strong> {test.output}
                  </p>
                </div>
              ))}
            </div>

            {/* Language Selector + Code Editor - Fixed height */}
            <div className="h-1/2 flex flex-col bg-black">
              <div className="p-2 flex justify-end bg-gray-800">
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="border px-2 py-1 rounded"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div className="flex-1">
                <ProblemEditor
                  code={code}
                  setCode={setCode}
                  language={language}
                />
              </div>
            </div>

            {/* Buttons - Fixed at bottom */}
            <div className="p-4 bg-gray-200 flex justify-end space-x-4 border-t">
              <button
                onClick={handleRunCode}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Select a problem to view details and code editor.
          </div>
        )}
      </div>
    </div>
  );
}
