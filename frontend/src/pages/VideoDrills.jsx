import React, { useEffect, useState } from "react";
import VideoDrill from "../components/VideoDrill";
import { getAllVideoDrills } from "../services/videoDrillService";
import { getMyScores } from "../services/scoreService";
import { updateStudentAssessment } from "../services/assessmentService";
import useTranslation from "../hooks/useTranslation";

import NetworkError from "../components/NetworkError";
import { useLocation } from "react-router-dom";

const VideoDrills = () => {
  const [drills, setDrills] = useState([]);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  // Get navigation state if needed
  const location = useLocation();

  // Debug navigation state
  useEffect(() => {
    console.log(`[DEBUG VideoDrills] Navigation state:`, location.state);
    console.log(`[DEBUG VideoDrills] AssessmentId from state:`, location.state?.assessmentId);
  }, [location.state]);

  useEffect(() => {
    getAllVideoDrills()
      .then(setDrills)
      .catch((err) => setError(err));
    getMyScores()
      .then(setScores)
      .catch((err) => setError(err));
  }, []);

  const { t } = useTranslation();
  if (error?.isNetworkError || error?.isServerError) {
    return <NetworkError message={error.message} />;
  }
  if (selectedDrill) {
    // Always show drill list when selectedDrill is null
    const handleBackToAllDrills = () => {
      setSelectedDrill(null);
      setSelectedAssessmentId(null);
    };
    return (
      <div>
        <button className="mb-4 px-4 py-2 bg-gray-200 rounded" onClick={handleBackToAllDrills}>
          {t("backToAllDrills")}
        </button>
        <VideoDrill drill={selectedDrill} assessmentId={selectedAssessmentId} onFinish={handleBackToAllDrills} />
      </div>
    );
  }

  // Group drills by disasterType
  const grouped = drills.reduce((acc, drill) => {
    acc[drill.disasterType] = acc[drill.disasterType] || [];
    acc[drill.disasterType].push(drill);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold p-5">{t("drills")}</h1>
      <p className="mt-4 ml-2">{t("drillsDesc")}</p>
      {Object.keys(grouped).map((type) => (
        <div key={type} className="mt-8">
          <h2 className="text-xl font-semibold mb-2">{type.charAt(0).toUpperCase() + type.slice(1)} {t("drills")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grouped[type].map((drill) => {
              // Find user's latest score for this drill
              const userScore = scores
                .filter(s => s.videoDrill === drill._id || (s.videoDrill?._id === drill._id))
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
              let indicator = null;
              let indicatorIcon = null;
              if (userScore) {
                if (userScore.points >= 20) {
                  indicator = <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold flex items-center"><span className="mr-1">✔️</span>Passed</span>;
                  indicatorIcon = <span className="text-green-500 text-xl mr-2">✔️</span>;
                } else {
                  indicator = <span className="ml-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold flex items-center"><span className="mr-1">❌</span>Not Passed</span>;
                  indicatorIcon = <span className="text-red-500 text-xl mr-2">❌</span>;
                }
              } else {
                indicator = <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-bold flex items-center"><span className="mr-1">⏳</span>Not Attempted</span>;
                indicatorIcon = <span className="text-gray-400 text-xl mr-2">⏳</span>;
              }
              // Disaster type icon (example: flood, earthquake, etc.)
              const disasterIcons = {
                flood: <span className="text-blue-400 text-xl mr-2">🌊</span>,
                earthquake: <span className="text-yellow-500 text-xl mr-2">🌎</span>,
                fire: <span className="text-red-500 text-xl mr-2">🔥</span>,
                cyclone: <span className="text-gray-500 text-xl mr-2">🌀</span>,
                default: <span className="text-gray-400 text-xl mr-2">⚡</span>
              };
              const disasterIcon = disasterIcons[drill.disasterType] || disasterIcons.default;
              return (
                <div key={drill._id} className="border rounded-2xl p-6 shadow-lg bg-white flex flex-col justify-between hover:shadow-2xl transition-shadow duration-200">
                  <div className="flex items-center mb-2">
                    {disasterIcon}
                    <span className="font-bold text-lg">{drill.lessons[0]?.title || "Untitled Drill"}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    {indicatorIcon}
                    {indicator}
                  </div>
                  <button
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow mt-2 transition-colors duration-150"
                    onClick={() => {
                      setSelectedDrill(drill);
                      // If assessmentId is present in location.state, use it, else null
                      const assessmentId = location.state?.assessmentId || null;
                      setSelectedAssessmentId(assessmentId);
                      
                      // If this is part of an assessment, mark it as "working" when started
                      if (assessmentId) {
                        console.log(`[DEBUG VideoDrills] Starting assessment ${assessmentId}, setting status to working`);
                        updateStudentAssessment(assessmentId, 0, "working").then((response) => {
                          console.log("[DEBUG VideoDrills] Assessment status updated to working:", response.data);
                        }).catch((err) => {
                          console.error("[DEBUG VideoDrills] Failed to update assessment status to working:", err);
                          console.error("[DEBUG VideoDrills] Error details:", err.response?.data || err.message);
                        });
                      }
                    }}
                  >
                    <span role="img" aria-label="play">▶️</span> Start Drill
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoDrills;
