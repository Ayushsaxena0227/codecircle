import React, { useEffect, useState, useMemo, useRef, memo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import toast from "react-hot-toast";
import { Doughnut } from "react-chartjs-2";
import Spinner from "../../components/Spinner";

const BASE_URL = import.meta.env.VITE_URL;

export default function DashboardPage() {
  const [info, setInfo] = useState(null);
  const [loading, setLoad] = useState(true);
  const [chartReady, setReady] = useState(false);
  const fetchedOnce = useRef(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || fetchedOnce.current) return;
      fetchedOnce.current = true;
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${BASE_URL}/user/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setInfo(json);
        import("chart.js/auto").then(() => setReady(true)); // lazy-load
      } catch (e) {
        toast.error(e.message || "Failed to load dashboard");
      } finally {
        setLoad(false);
      }
    });
    return () => unsub();
  }, []);

  /* define memoised data no matter what (can be undefined first render) */
  const chartData = useMemo(() => {
    if (!info) return null;
    const { stats } = info;
    return {
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
  }, [info]);

  if (loading) return <Spinner />;
  if (!info) return null;

  const { profile, stats } = info;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {/* profile */}
      <Card>
        <h3 className="text-lg font-medium mb-2">Profile</h3>
        <p>
          <span className="font-medium">Email:</span> {profile.email}
        </p>
        <p>
          <span className="font-medium">Joined:</span>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </Card>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <Stat label="Total Submissions" value={stats.submissions} />
        <Stat label="Accepted" value={stats.accepted} />
        <Stat label="Problems Solved" value={stats.problemsSolved} />
      </div>

      {/* chart */}
      {chartReady && chartData && (
        <div className="max-w-sm mx-auto">
          <Doughnut data={chartData} />
          <p className="text-center mt-3 text-sm text-gray-500">
            Solved by Difficulty
          </p>
        </div>
      )}
    </div>
  );
}

/* helper card */
const Card = ({ children }) => (
  <div className="bg-white shadow rounded p-6 mb-6">{children}</div>
);

const Stat = memo(({ label, value }) => (
  <Card>
    <p className="text-3xl font-bold text-blue-600">{value}</p>
    <p className="mt-1 text-gray-500 text-sm">{label}</p>
  </Card>
));
