import { useState } from "react";
import { auth } from "../../../Firebase/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { createUserInDB } from "../../../utils/createUserInDb";
import React from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      await createUserInDB(token);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      const token = await userCred.user.getIdToken();
      await createUserInDB(token);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-sm mx-auto space-y-4">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border w-full p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border w-full p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Login
      </button>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        Login with Google
      </button>
    </form>
  );
}
