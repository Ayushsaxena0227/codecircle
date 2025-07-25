import { useState } from "react";
import { auth } from "../../../Firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { createUserInDB } from "../../../utils/createUserInDb";
import React from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCred.user.getIdToken();
      console.log(token);
      await createUserInDB(token);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="p-4 max-w-sm mx-auto space-y-4">
      <h2 className="text-xl font-bold">Signup</h2>
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
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Sign Up
      </button>
    </form>
  );
}
