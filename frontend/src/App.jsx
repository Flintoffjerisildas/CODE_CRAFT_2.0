import React from "react";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScenarioPlayer from "./pages/ScenarioPlayer";
import Leaderboard from "./pages/Leaderboard";
import VideoDrills from "./pages/VideoDrills";
import VideoDrill from "./components/VideoDrill";
import TeacherAssessments from "./pages/TeacherAssessments";
import MyAssessments from "./pages/MyAssessments";

// Wrapper to extract :disasterType param
function VideoDrillWrapper() {
  const { disasterType } = useParams();
  const location = useLocation();
  
  console.log(`[DEBUG VideoDrillWrapper] disasterType: ${disasterType}`);
  console.log(`[DEBUG VideoDrillWrapper] location.state:`, location.state);
  console.log(`[DEBUG VideoDrillWrapper] assessmentId:`, location.state?.assessmentId);
  
  return <VideoDrill 
    disasterType={disasterType} 
    assessmentId={location.state?.assessmentId}
    onFinish={() => window.history.back()}
  />;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scenario/:scenarioId" element={<ScenarioPlayer />} />
          <Route path="/leaderboard/:drillId" element={<Leaderboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/drill/:disasterType" element={<VideoDrillWrapper />} />
          <Route path="/VideoDrills" element={<VideoDrills />} />
          <Route path="/teacher-assessments" element={<TeacherAssessments />} />
          <Route path="/my-assessments" element={<MyAssessments />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
