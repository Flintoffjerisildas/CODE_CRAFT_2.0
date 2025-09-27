import React from "react";
import { Link } from "react-router-dom";

const Hero = () => (
  <section className="w-full max-w-3xl mx-auto mt-10 mb-8 text-center">
    <h1 className="text-4xl font-extrabold text-blue-700 mb-4">PrepEd</h1>
    <p className="text-lg text-gray-700 mb-6">
      Gamified Disaster Management Awareness for Students
    </p>
    <Link
      to="/videodrills"
      className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold shadow-lg hover:bg-pink-700 transition-colors duration-150"
    >
      🚀 Try Video Drills
    </Link>
  </section>
);

export default Hero;
