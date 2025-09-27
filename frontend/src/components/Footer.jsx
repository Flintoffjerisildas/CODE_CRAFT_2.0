// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-600 text-center">
        &copy; {new Date().getFullYear()} PrepEd • Built for SIH • All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
