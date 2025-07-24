import React from "react";
import MonacoEditor from "react-monaco-editor";

export default function ProblemEditor({ code, setCode, language }) {
  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="w-full h-full">
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
    </div>
  );
}
