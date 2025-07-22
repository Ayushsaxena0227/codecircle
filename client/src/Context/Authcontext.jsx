import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("leetcode-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem("leetcode-user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("leetcode-user");
      }
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
