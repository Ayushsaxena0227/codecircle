import React from "react";

export default function ProblemSidebar({ problems, selectedId, onSelect }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "hard":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Easy:{" "}
            {
              problems.filter((p) => p.difficulty?.toLowerCase() === "easy")
                .length
            }
          </span>
          <span>
            Medium:{" "}
            {
              problems.filter((p) => p.difficulty?.toLowerCase() === "medium")
                .length
            }
          </span>
          <span>
            Hard:{" "}
            {
              problems.filter((p) => p.difficulty?.toLowerCase() === "hard")
                .length
            }
          </span>
        </div>
      </div>
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-lg font-semibold text-gray-900">Problems</h1>
        <p className="text-sm text-gray-500 mt-1">{problems.length} problems</p>
      </div>

      {/* Problems List */}
      <div className="flex-1 overflow-y-auto">
        {problems.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-500">No problems available</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {problems.map((problem, index) => (
              <div
                key={problem.id}
                onClick={() => onSelect(problem)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedId === problem.id
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm text-gray-500 font-mono">
                        {index + 1}.
                      </span>
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {problem.title}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-xs font-medium capitalize ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>

                      {problem.tags && problem.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          {problem.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{problem.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status indicator - you can add this based on user's submission status */}
                  <div className="ml-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
    </div>
  );
}
