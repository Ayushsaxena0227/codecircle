import React from "react";
import MonacoEditor from "react-monaco-editor";

export default function ProblemEditor({
  code,
  setCode,
  language,
  loading = false,
}) {
  const handleEditorChange = (val) => setCode(val);

  return (
    <div className="w-full h-full relative">
      <MonacoEditor
        width="100%"
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          automaticLayout: true,
        }}
      />

      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex flex-col space-y-2 p-4 animate-pulse cursor-wait">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 ${
                i % 3 === 0 ? "w-3/5" : i % 3 === 1 ? "w-4/5" : "w-2/5"
              } bg-gray-700 rounded`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
