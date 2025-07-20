import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-4 text-xl">Home Page</div>} />
      <Route
        path="/problems"
        element={<div className="p-4 text-xl">Problems Page</div>}
      />
      <Route
        path="/profile"
        element={<div className="p-4 text-xl">Profile Page</div>}
      />
    </Routes>
  );
}
export default App;
