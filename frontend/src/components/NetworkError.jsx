// src/components/NetworkError.jsx
import React from "react";

const NetworkError = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center my-4">
    <strong>Network Error:</strong> {message || "Unable to connect. Please check your internet connection and try again."}
  </div>
);

export default NetworkError;
