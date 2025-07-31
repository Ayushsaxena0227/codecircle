import React, { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaCheck } from "react-icons/fa";
import { auth } from "../../../Firebase/firebase";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_URL;

export default function ProblemSidebar({
  problems,
  selectedId,
  onSelect,
  solved = new Set(),
}) {
  const [favs, setFavs] = useState([]); // array of problemIds
  const [loadingFavs, setLoadingFavs] = useState(true);
  // console.log(solved);

  useEffect(() => {
    (async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch(`${BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { favorites } = await res.json();
        setFavs(favorites);
      } catch {
        // silent fail
      } finally {
        setLoadingFavs(false);
      }
    })();
  }, []);

  const toggleFav = async (problemId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${BASE_URL}/favorites/${problemId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const { favored } = await res.json();
      setFavs((prev) =>
        favored ? [...prev, problemId] : prev.filter((id) => id !== problemId)
      );
      toast.success(
        favored ? "Added to favourites ⭐" : "Removed from favourites"
      );
    } catch {
      toast.error("Could not update favourites");
    }
  };

  const getDifficultyColor = (d) =>
    d?.toLowerCase() === "easy"
      ? "text-green-600"
      : d?.toLowerCase() === "medium"
      ? "text-yellow-600"
      : d?.toLowerCase() === "hard"
      ? "text-red-600"
      : "text-gray-600";

  return (
    <div className="flex flex-col h-full">
      {/* header counts */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between">
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

      {/* title */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-lg font-semibold">Problems</h1>
        <p className="text-sm text-gray-500">{problems.length} problems</p>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {problems.map((problem, idx) => {
          const isFav = favs.includes(problem.id);
          const isSolved = solved.has(problem.id);
          return (
            <div
              key={problem.id}
              onClick={() => onSelect(problem)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                selectedId === problem.id
                  ? "bg-blue-50 border-r-2 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                {/* left block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-500 font-mono">
                      {idx + 1}.
                    </span>
                    <h3 className="text-sm font-medium truncate">
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

                    {problem.tags?.length > 0 && (
                      <div className="flex space-x-1">
                        {problem.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-gray-100 rounded"
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

                {/* right: star + check */}
                <div className="ml-2 flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav(problem.id);
                    }}
                    disabled={loadingFavs}
                    className="text-yellow-500 hover:scale-110 transition cursor-pointer"
                    title={
                      isFav ? "Remove from favourites" : "Add to favourites"
                    }
                  >
                    {isFav ? <FaStar /> : <FaRegStar />}
                  </button>
                  {isSolved && <FaCheck className="text-green-500 w-3 h-3" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
