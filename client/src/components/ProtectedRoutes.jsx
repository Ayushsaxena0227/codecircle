import { Navigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../Context/Authcontext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
