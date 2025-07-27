import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Practice. Compete. Get better.
      </h1>

      <p className="text-gray-600 mb-8">
        CodeCircle helps you master algorithms &amp; data-structures with
        curated problems and real-time judging. Track your progress, beat the
        leaderboard, and land your dream job.
      </p>

      <div className="flex justify-center space-x-4">
        <Link
          to="/problems"
          className="px-6 py-3 bg-blue-600 text-white rounded shadow"
        >
          Start Solving
        </Link>

        <Link
          to="/dashboard"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
