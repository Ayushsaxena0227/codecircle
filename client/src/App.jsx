import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./Pages/Auth/Signup";
import Login from "./Pages/Auth/Login";
import React from "react";
import Profile from "./Pages/User";
import ProtectedRoute from "./components/ProtectedRoutes";
import ProblemList from "./Pages/Platform/Problems";
import HomePage from "./Pages/Other/Home";
import DashboardPage from "./Pages/User";
import FavoritesPage from "./Pages/Other/Favourite";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <ProblemList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/:problemid"
          element={
            <ProtectedRoute>
              <ProblemList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
