import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../Firebase/firebase";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_URL;

export default function FavoritesPage() {
  const [favProblems, setFavProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* fetch after Firebase restores session */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("Please log in to view favourites.");
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();

        /* 1️⃣ favourite IDs */
        const favRes = await fetch(`${BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { favorites } = await favRes.json();

        /* 2️⃣ full problem list then filter */
        if (favorites.length) {
          const probRes = await fetch(`${BASE_URL}/problems`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const all = await probRes.json();
          setFavProblems(all.filter((p) => favorites.includes(p.id)));
        }
      } catch {
        toast.error("Failed to load favourites");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 font-lexend">
      <h1 className="text-3xl font-semibold mb-6">My Favourites</h1>

      {favProblems.length === 0 ? (
        <p className="text-gray-500">You haven’t starred any problems yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200 dark:ring-gray-700">
          <table className="min-w-full bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 w-12 text-left">#</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 w-32 text-left">Difficulty</th>
                <th className="p-3 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {favProblems.map((p, idx) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/problems/${p.id}`)}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <td className="p-3 font-mono text-gray-500">{idx + 1}</td>
                  <td className="p-3 text-white">{p.title}</td>
                  <td className="p-3">
                    <DiffBadge diff={p.difficulty} />
                  </td>
                  <td className="p-3">
                    {p.tags?.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 mr-1 mb-1 inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* Difficulty pill */
const DiffBadge = ({ diff }) => {
  const base = "px-2 py-0.5 rounded-full text-xs font-medium capitalize";
  if (!diff) return null;
  switch (diff.toLowerCase()) {
    case "easy":
      return (
        <span className={`${base} bg-green-100 text-green-700`}>easy</span>
      );
    case "medium":
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>medium</span>
      );
    case "hard":
      return <span className={`${base} bg-red-100 text-red-700`}>hard</span>;
    default:
      return (
        <span className={`${base} bg-gray-200 text-gray-600`}>{diff}</span>
      );
  }
};
