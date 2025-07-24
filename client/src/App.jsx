import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./Pages/Auth/Signup";
import Login from "./Pages/Auth/Login";
import React from "react";
import Profile from "./Pages/User";
import ProtectedRoute from "./components/ProtectedRoutes";
import ProblemList from "./Pages/Platform/Problems";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<div className="p-4">Home</div>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/api/problem"
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
