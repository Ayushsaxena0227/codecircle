import React from "react";

export default function ActionButtons({ onRun }) {
  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={onRun}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors flex items-center space-x-2"
      >
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
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8a2 2 0 012-2z"
          />
        </svg>
        <span>Run Code</span>
      </button>
    </div>
  );
}
