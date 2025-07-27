import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Context/Authcontext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {/* global toast container */}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
