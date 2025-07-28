import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { HiLightningBolt, HiChartBar, HiUsers } from "react-icons/hi";

export default function HomePage() {
  /* fake API numbers (replace with real fetch later) */
  const [stats, setStats] = useState({
    problems: 320,
    submissions: 14892,
    users: 1054,
  });

  /* optional: fetch real stats once */
  // useEffect(() => {
  //   fetch("/api/public/stats").then(r => r.json()).then(setStats);
  // }, []);

  return (
    <div className="font-lexend">
      {/* ---------------- HERO ---------------- */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Practice. Compete. Get better.
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          CodeCircle helps you master algorithms &amp; data-structures with
          curated problems and real-time judging. Track your progress, climb the
          leaderboard, and land your dream job.
        </p>
        <div className="flex justify-center space-x-4">
          <CTAButton to="/problems" primary>
            Start Solving
          </CTAButton>
          <CTAButton to="/dashboard">View Dashboard</CTAButton>
        </div>
      </section>

      {/* ---------------- LIVE STATS ---------------- */}
      <section className="bg-blue-50 dark:bg-blue-900 py-8">
        <div className="max-w-4xl mx-auto flex justify-around text-center">
          <StatBox
            icon={<HiLightningBolt className="w-6 h-6" />}
            label="Problems"
            value={stats.problems}
          />
          <StatBox
            icon={<HiUsers className="w-6 h-6" />}
            label="Developers"
            value={stats.users}
          />
          <StatBox
            icon={<HiChartBar className="w-6 h-6" />}
            label="Submissions"
            value={stats.submissions}
          />
        </div>
      </section>

      {/* ---------------- FEATURES GRID ---------------- */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-3">
        {[
          {
            title: "Solve",
            body: "Hand-picked problems with editor-ready boilerplate for JS, Python & C++.",
          },
          {
            title: "Compete",
            body: "Timed contests & leaderboards coming soon—measure yourself against peers.",
          },
          {
            title: "Track",
            body: "Personal dashboard with streaks, difficulty breakdown & detailed history.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white dark:bg-gray-800 shadow rounded p-6"
          >
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{f.body}</p>
          </div>
        ))}
      </section>

      {/* ---------------- SCREENSHOT / GIF ---------------- */}
      <section className="max-w-6xl mx-auto px-4 py-10 text-center">
        {/* Replace src with a real editor screenshot or animated GIF */}
        <img
          src="https://placehold.co/900x450?text=Editor+Screenshot"
          alt="Editor screenshot"
          className="rounded shadow border mx-auto"
        />
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
          <div className="mb-6 sm:mb-0">
            <h4 className="text-xl font-semibold mb-1">
              Built&nbsp;in&nbsp;public.
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md">
              CodeCircle is 100% open-source. Star us, fork us, or open a PR—the
              roadmap lives on GitHub.
            </p>
          </div>
          <a
            href="https://github.com/Ayushsaxena0227/codecircle"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md shadow hover:bg-gray-900 transition"
          >
            <FaGithub className="mr-2" /> GitHub
          </a>
        </div>
      </section>

      <section className="bg-blue-600 py-12 text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Ready to get started?
        </h3>
        <div className="flex justify-center space-x-4">
          <CTAButton to="/problems" primary inverted>
            Start Solving
          </CTAButton>
          <CTAButton to="/dashboard" inverted>
            Dashboard
          </CTAButton>
        </div>
      </section>
    </div>
  );
}

const StatBox = ({ icon, label, value }) => (
  <div className="flex flex-col items-center">
    <div className="text-blue-600 dark:text-blue-300 mb-1">{icon}</div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-gray-600 dark:text-gray-300 text-xs">{label}</p>
  </div>
);

const CTAButton = ({ to, children, primary, inverted }) => {
  const base =
    "px-6 py-3 rounded font-medium transition shadow focus:outline-none focus:ring";
  const color = primary
    ? inverted
      ? "bg-white text-blue-600 hover:bg-blue-50"
      : "bg-blue-600 text-white hover:bg-blue-700"
    : inverted
    ? "border border-white text-white hover:bg-white hover:text-blue-600"
    : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white";

  return (
    <Link to={to} className={`${base} ${color}`}>
      {children}
    </Link>
  );
};
