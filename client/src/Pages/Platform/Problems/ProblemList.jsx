import { useEffect, useState } from "react";
import { auth } from "../../../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import MonacoEditor from "react-monaco-editor";
import React from "react";

const BASE_URL = import.meta.env.VITE_URL;

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState("// Write your code here");
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
          console.log(data);
          setProblems(data);
          if (data.length > 0) {
            setSelectedProblem(data[0]);
          }
        } catch (err) {
          console.error("Fetch Error:", err);
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
    alert("Code run placeholder - implement backend execution!");
  };

  const handleSubmit = () => {
    console.log("Submitting code:", code);
    alert("Submission placeholder - check against test cases!");
  };

  if (loading) {
    return <div className="p-4 text-center">Loading problems...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side: Problem List */}
      <div className="w-1/3 bg-gray-100 border-r border-gray-300 overflow-y-auto p-4">
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

      {/* Right Side: Problem Details + Code Editor */}
      <div className="w-2/3 flex flex-col overflow-hidden">
        {selectedProblem ? (
          <>
            {/* Problem Details */}
            <div className="p-4 border-b border-gray-300 overflow-y-auto">
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

            {/* Monaco Code Editor */}
            <div className="flex-1">
              <MonacoEditor
                width="100%"
                height="100%"
                language="javascript" // Change to other languages as needed
                theme="vs-dark" // Dark theme like LeetCode
                value={code}
                onChange={(newValue) => setCode(newValue)}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-gray-200 flex justify-end space-x-4">
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
