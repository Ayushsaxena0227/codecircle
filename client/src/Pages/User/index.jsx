import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import toast from "react-hot-toast";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const BASE_URL = import.meta.env.VITE_URL;

export default function DashboardPage() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedonce, Setcheckedonce] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (checkedonce) {
          toast.error("Please log in to view the dashboard.");
        }
        setLoading(false);
        Setcheckedonce(true);
        return navigate("/login");
      }
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${BASE_URL}/user/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setInfo(json);
      } catch (e) {
        toast.error(e.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!info) return null;
  const { profile, stats } = info;
  const chartData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [
          stats.solvedByDifficulty.easy,
          stats.solvedByDifficulty.medium,
          stats.solvedByDifficulty.hard,
        ],
        backgroundColor: ["#34d399", "#fbbf24", "#f87171"],
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {/* profile card */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h3 className="text-lg font-medium mb-2">Profile</h3>
        <p>
          <span className="font-medium">Email:</span> {profile.email}
        </p>
        <p>
          <span className="font-medium">Joined:</span>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <Stat label="Total Submissions" value={stats.submissions} />
        <Stat label="Accepted" value={stats.accepted} />
        <Stat label="Problems Solved" value={stats.problemsSolved} />
      </div>

      {/* donut */}
      <div className="max-w-sm mx-auto">
        <Doughnut data={chartData} />
        <p className="text-center mt-3 text-sm text-gray-500">
          Solved by Difficulty
        </p>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white shadow rounded p-6 text-center">
    <p className="text-3xl font-bold text-blue-600">{value}</p>
    <p className="mt-1 text-gray-500 text-sm">{label}</p>
  </div>
);
