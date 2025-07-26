import React from "react";

export default function ActionButtons({
  onRun,
  onSubmit,
  disabled = false,
  isRunning = false,
  isSubmitting = false,
}) {
  const base =
    "px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2";
  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
      />
    </svg>
  );

  return (
    <div className="flex items-center space-x-3">
      {/* RUN */}
      <button
        onClick={onRun}
        disabled={disabled || isRunning || isSubmitting}
        className={`${base} ${
          disabled || isSubmitting
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isRunning ? (
          spinner
        ) : (
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
        )}
        <span>Run</span>
      </button>

      {/* SUBMIT */}
      <button
        onClick={onSubmit}
        disabled={disabled || isRunning || isSubmitting}
        className={`${base} ${
          disabled || isRunning
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {isSubmitting ? (
          spinner
        ) : (
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        <span>Submit</span>
      </button>
    </div>
  );
}
