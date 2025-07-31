import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../../Firebase/firebase";
import { createUserInDB } from "../../../utils/createUserInDb";
import { BiSolidHide } from "react-icons/bi";
import { HiEye } from "react-icons/hi";

const googleProvider = new GoogleAuthProvider();

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setshow] = useState(false);
  const navigate = useNavigate();
  const handletoggle = () => {
    setshow((prev) => !prev);
  };

  const doSignup = async (credPromise) => {
    setLoading(true);
    try {
      const { user } = await credPromise;
      const token = await user.getIdToken();
      await createUserInDB(token);
      toast.success("Account created! 🎉");
      navigate("/problems");
    } catch (e) {
      toast.error(e.message || "Sign-up failed");
      setLoading(false);
    }
  };

  if (loading) return <AuthSkeleton />;

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doSignup(createUserWithEmailAndPassword(auth, email, password));
        }}
        className="bg-white dark:bg-gray-800 shadow rounded p-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200">
          Sign Up
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="border w-full p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {show ? (
            <BiSolidHide
              onClick={handletoggle}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 cursor-pointer"
              title="Hide password"
            />
          ) : (
            <HiEye
              onClick={handletoggle}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 cursor-pointer"
              title="Show password"
            />
          )}
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Sign Up
        </button>

        <button
          type="button"
          onClick={() => doSignup(signInWithPopup(auth, googleProvider))}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          Sign Up with Google
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}

function AuthSkeleton() {
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
