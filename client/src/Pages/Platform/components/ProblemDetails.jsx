import React from "react";

export default function ProblemDetails({ problem }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "hard":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatInputFormat = (inputFormat) => {
    if (!inputFormat) return null;

    return Object.entries(inputFormat).map(([key, value]) => (
      <div key={key} className="text-sm">
        <span className="font-medium text-gray-700">
          {key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
          :
        </span>
        <span className="ml-2 text-gray-600">{value}</span>
      </div>
    ));
  };

  return (
    <div className="p-6 overflow-y-auto">
      {/* Problem Title and Difficulty */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {problem.title}
        </h1>

        <div className="flex items-center flex-wrap gap-3 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize border ${getDifficultyColor(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>

          {problem.tags && problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md border border-blue-200 hover:bg-blue-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Acceptance Rate and Submissions */}
        {(problem.acceptanceRate || problem.totalSubmissions) && (
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
            {problem.acceptanceRate && (
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Accepted:{" "}
                  <span className="font-medium text-green-600">
                    {problem.acceptanceRate}
                  </span>
                </span>
              </div>
            )}
            {problem.totalSubmissions && (
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16l4-4 4 4V4z"
                  />
                </svg>
                <span>
                  Submissions:{" "}
                  <span className="font-medium">
                    {problem.totalSubmissions}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Problem Description */}
      <div className="mb-8">
        <div className="prose prose-sm max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>
      </div>

      {/* Input/Output Format */}
      {(problem.inputFormat || problem.outputFormat) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Input/Output Format
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            {problem.inputFormat && (
              <div className="mb-3">
                <h4 className="font-medium text-gray-800 mb-2">Input:</h4>
                <div className="space-y-1">
                  {formatInputFormat(problem.inputFormat)}
                </div>
              </div>
            )}
            {problem.outputFormat && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Output:</h4>
                <div className="text-sm text-gray-600">
                  {problem.outputFormat}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Examples/Test Cases */}
      {problem.testCases && problem.testCases.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>

          <div className="space-y-6">
            {problem.testCases.map((testCase, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded border">
                    Example {index + 1}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                      Input:
                    </div>
                    <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm overflow-x-auto border">
                      <pre className="whitespace-pre-wrap">
                        {testCase.input}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 13l3 3 7-7"
                        />
                      </svg>
                      Output:
                    </div>
                    <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm overflow-x-auto border">
                      <pre className="whitespace-pre-wrap">
                        {testCase.output}
                      </pre>
                    </div>
                  </div>

                  {testCase.explanation && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Explanation:
                      </div>
                      <div className="text-sm text-gray-700 bg-white p-3 rounded border border-blue-200">
                        {testCase.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            Constraints
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {problem.constraints}
            </div>
          </div>
        </div>
      )}

      {/* Time and Space Complexity */}
      {(problem.timeComplexity || problem.spaceComplexity) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Expected Complexity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problem.timeComplexity && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <svg
                    className="w-4 h-4 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium text-green-800">
                    Time Complexity
                  </span>
                </div>
                <div className="text-sm text-green-700 font-mono bg-white px-2 py-1 rounded border border-green-200">
                  {problem.timeComplexity}
                </div>
              </div>
            )}
            {problem.spaceComplexity && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <svg
                    className="w-4 h-4 mr-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0 2.21-3.582 4-8 4s-8-1.79-8-4z"
                    />
                  </svg>
                  <span className="font-medium text-purple-800">
                    Space Complexity
                  </span>
                </div>
                <div className="text-sm text-purple-700 font-mono bg-white px-2 py-1 rounded border border-purple-200">
                  {problem.spaceComplexity}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Follow-up */}
      {problem.followUp && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Follow-up
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-gray-700">{problem.followUp}</div>
          </div>
        </div>
      )}

      {/* Companies/Similar Problems - Optional for future */}
      <div className="border-t pt-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Acceptance Rate:</span>
            <span className="ml-2 text-gray-700 font-medium">
              {problem.acceptanceRate || "N/A"}
            </span>
          </div>

          <div className="flex items-center text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16l4-4 4 4V4z"
              />
            </svg>
            <span className="font-medium">Total Submissions:</span>
            <span className="ml-2 text-gray-700 font-medium">
              {problem.totalSubmissions || "N/A"}
            </span>
          </div>

          <div className="flex items-center text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="font-medium">Difficulty:</span>
            <span
              className={`ml-2 font-medium capitalize ${
                problem.difficulty === "easy"
                  ? "text-green-600"
                  : problem.difficulty === "medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {problem.difficulty || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
