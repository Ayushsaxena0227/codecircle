import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { useAuth } from "../Context/Authcontext";
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="flex justify-between p-4 bg-gray-800 text-white">
      <Link to="/">Home</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span>{user.email}</span>
            <button
              onClick={() => signOut(auth)}
              className="bg-red-500 px-2 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
}
