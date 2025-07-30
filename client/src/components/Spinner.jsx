import React from "react";
export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      {" "}
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />{" "}
    </div>
  );
}
