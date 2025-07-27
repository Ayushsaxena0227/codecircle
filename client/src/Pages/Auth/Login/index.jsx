import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../../Firebase/firebase";
import { createUserInDB } from "../../../utils/createUserInDb";

const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const doLogin = async (credPromise) => {
    setLoading(true);
    try {
      const { user } = await credPromise;
      const token = await user.getIdToken();
      await createUserInDB(token);
      toast.success("Logged-in successfully!");
      navigate("/problems");
    } catch (e) {
      toast.error(e.message || "Login failed");
      setLoading(false);
    }
  };

  if (loading) return <LoginSkeleton />;

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doLogin(signInWithEmailAndPassword(auth, email, password));
        }}
        className="bg-white dark:bg-gray-800 shadow rounded p-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Login
        </button>

        <button
          type="button"
          onClick={() => doLogin(signInWithPopup(auth, googleProvider))}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          Login with Google
        </button>
      </form>
    </div>
  );
}

/* ---------- skeleton -------------- */
function LoginSkeleton() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 w-full max-w-sm animate-pulse space-y-4">
        <div className="h-6 w-24 mx-auto bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
