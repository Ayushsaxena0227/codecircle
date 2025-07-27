import React, { useEffect, useState } from "react";
import { auth } from "../../../Firebase/firebase";
import MonacoEditor from "react-monaco-editor";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_URL;

export default function SubmissionsTab({ problemId }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoad] = useState(true);
  const [openId, setOpenId] = useState(null);

  /* fetch on mount / when problemId changes */
  useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`${BASE_URL}/submit/${problemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setSubs(data.submissions);
      } catch (e) {
        toast.error(e.message || "Failed to load submissions");
      } finally {
        setLoad(false);
      }
    })();
  }, [problemId]);

  if (loading)
    return (
      <div className="flex justify-center py-6">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!subs.length)
    return (
      <div className="py-10 text-center text-gray-400">No submissions yet</div>
    );

  const selected = subs.find((s) => s.id === openId);

  return (
    <>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Language</th>
              <th className="py-2 pr-4">Verdict</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s, idx) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="py-2 pr-4">{idx + 1}</td>
                <td className="py-2 pr-4">
                  {new Date(s.timestamp).toLocaleString()}
                </td>
                <td className="py-2 pr-4">{s.language}</td>
                <td className="py-2 pr-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      s.verdict === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : s.verdict === "Error"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.verdict}
                  </span>
                </td>
                <td className="py-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setOpenId(s.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------- modal -------- */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-5/6 rounded shadow-xl flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">
                Submission Details
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setOpenId(null)}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex">
              <div className="w-1/2 border-r">
                <MonacoEditor
                  width="100%"
                  height="100%"
                  language={selected.language}
                  theme="vs-dark"
                  value={selected.code}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    automaticLayout: true,
                  }}
                />
              </div>
              <div className="w-1/2 p-4 overflow-y-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="py-1 pr-2">#</th>
                      <th className="py-1 pr-2">Input</th>
                      <th className="py-1 pr-2">Output</th>
                      <th className="py-1">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.testCaseResults.map((t, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-1 pr-2">{i + 1}</td>
                        <td className="py-1 pr-2 whitespace-pre-wrap">
                          {t.input}
                        </td>
                        <td className="py-1 pr-2 whitespace-pre-wrap">
                          {t.userOutput}
                        </td>
                        <td className="py-1">{t.passed ? "✅" : "❌"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
