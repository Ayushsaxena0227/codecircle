import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/Authcontext";
import { FaStar } from "react-icons/fa";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded hover:bg-gray-100 ${
      isActive ? "font-semibold text-blue-600" : "text-gray-600"
    }`;

  return (
    <header className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-14">
        <NavLink
          to="/"
          className="font-extrabold text-lg text-blue-600 dark:text-blue-400"
        >
          CodeCircle
        </NavLink>

        <nav className="ml-6 space-x-2 flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          {user && (
            <>
              <NavLink to="/problems" className={linkClass}>
                Problems
              </NavLink>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink
                to="/favorites"
                title="Favourites"
                className={({ isActive }) =>
                  `p-2 rounded hover:bg-gray-100 mt-1 ${
                    isActive ? "text-yellow-500" : "text-gray-600"
                  }`
                }
              >
                <FaStar />
              </NavLink>
            </>
          )}
        </nav>

        <button
          onClick={toggleTheme}
          className="ml-auto mr-2 text-xl focus:outline-none cursor-pointer"
          title="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {user ? (
          <button
            onClick={() => signOut(auth)}
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
