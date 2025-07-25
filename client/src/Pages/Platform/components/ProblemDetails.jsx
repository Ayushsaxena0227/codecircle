import React from "react";

export default function ProblemDetails({ problem }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-6 overflow-y-auto">
      {/* Problem Title and Difficulty */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {problem.title}
        </h1>

        <div className="flex items-center space-x-4 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getDifficultyColor(
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
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Problem Description */}
      <div className="mb-8">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </p>
        </div>
      </div>

      {/* Examples/Test Cases */}
      {problem.testCases && problem.testCases.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>

          <div className="space-y-6">
            {problem.testCases.map((testCase, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Example {index + 1}:
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Input:
                    </div>
                    <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                      {testCase.input}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Output:
                    </div>
                    <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                      {testCase.output}
                    </div>
                  </div>

                  {testCase.explanation && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Explanation:
                      </div>
                      <div className="text-sm text-gray-700 bg-white p-3 rounded border">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Constraints
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {problem.constraints}
            </div>
          </div>
        </div>
      )}

      {/* Follow-up */}
      {problem.followUp && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Follow-up
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-gray-700">{problem.followUp}</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-gray-500">
            <span className="font-medium">Acceptance Rate:</span>
            <span className="ml-2 text-gray-700">
              {problem.acceptanceRate || "N/A"}
            </span>
          </div>
          <div className="text-gray-500">
            <span className="font-medium">Total Submissions:</span>
            <span className="ml-2 text-gray-700">
              {problem.totalSubmissions || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
