import React, { useEffect, useState, useRef } from "react";
import { saveScore } from "../services/scoreService";
import { updateStudentAssessment } from "../services/assessmentService";

// Accepts either a drill object or disasterType (for backward compatibility)
const VideoDrill = ({ drill: drillProp, disasterType = "flood", assessmentId, onFinish }) => {
  const [drill, setDrill] = useState(drillProp || null);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const videoRef = useRef();
  const [loading, setLoading] = useState(false);
  const [drillFinished, setDrillFinished] = useState(false);

  // Log the context on component mount
  useEffect(() => {
    console.log(`[DEBUG VideoDrill] Component mounted with assessmentId: ${assessmentId}`);
    if (assessmentId) {
      console.log(`[DEBUG VideoDrill] 🎯 ASSESSMENT CONTEXT - Status updates will work!`);
    } else {
      console.log(`[DEBUG VideoDrill] ❌ DIRECT DRILL CONTEXT - No status updates (assessmentId is undefined)`);
    }
  }, []);

  // Handle assessment status update when drill finishes
  useEffect(() => {
    console.log(`[DEBUG VideoDrill] useEffect triggered: drillFinished=${drillFinished}, score=${score}, assessmentId=${assessmentId}`);
    if (drillFinished && assessmentId) {
      const newStatus = score >= 20 ? "completed" : "working";
      console.log(`[DEBUG VideoDrill] Drill finished with score ${score}. Updating assessment ${assessmentId} status to ${newStatus}`);
      updateStudentAssessment(assessmentId, score, newStatus).then((response) => {
        console.log("[DEBUG VideoDrill] Assessment status updated successfully:", response.data);
      }).catch((err) => {
        console.error("[DEBUG VideoDrill] Failed to update assessment status:", err);
        console.error("[DEBUG VideoDrill] Error details:", err.response?.data || err.message);
      });
    }
  }, [drillFinished, score, assessmentId]);

  // If no drill prop, fetch by disasterType (legacy usage)
  useEffect(() => {
    if (!drillProp) {
      import("../services/videoDrillService").then(({ getDrillByDisasterType }) => {
        getDrillByDisasterType(disasterType).then((data) => {
          setDrill(Array.isArray(data) ? data[0] : data);
        });
      });
    }
  }, [disasterType, drillProp]);

  // Play main video when lesson changes
  useEffect(() => {
    if (drill && !selectedOption && videoRef.current) {
      const lesson = drill.lessons[lessonIdx];
      setLoading(true); // start loading
      videoRef.current.src = lesson.videoUrl;
      videoRef.current.play().catch(() => {}); // handle autoplay block silently
    }
  }, [drill, lessonIdx, selectedOption]);

  if (!drill) return <div className="text-center py-10">Loading...</div>;

  const lesson = drill.lessons[lessonIdx];

  const handleMainVideoEnd = () => setShowOptions(true);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    if (videoRef.current) {
      setLoading(true); // start loading
      videoRef.current.src = option.responseVideoUrl;
      videoRef.current.play().catch(() => {});
    }
    setScore((s) => s + (option.isCorrect ? 10 : -5));
  };

  const handleResponseVideoEnd = () => {
    setTimeout(() => {
      setSelectedOption(null);

      if (lessonIdx < drill.lessons.length - 1) {
        setLessonIdx((prev) => prev + 1);
      } else {
        // Set drillFinished immediately, save score in background
        setDrillFinished(true);
        saveScore({
          videoDrill: drill._id,
          disasterType: drill.disasterType,
          points: score,
          date: new Date().toISOString(),
        }).catch((err) => {
          console.error("Failed to save score:", err);
        });
        // Assessment status update is handled by useEffect
      }
    }, 2000);
  };

  if (drillFinished) {
    const passed = score >= 20;
    return (
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Drill Complete!</h2>
        <p className="mb-4">Your final score: <span className="text-teal-400 font-bold">{score}</span></p>
        <div className={`mb-4 text-lg font-semibold ${passed ? 'text-green-400' : 'text-red-400'}`}>{passed ? '✅ Passed' : '❌ Not Passed'}</div>
        {!passed ? (
          <button
            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold"
            onClick={() => {
              setLessonIdx(0);
              setScore(0);
              setSelectedOption(null);
              setShowOptions(false);
              setDrillFinished(false);
            }}
          >
            Restart Drill
          </button>
        ) : (
          <button
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
            onClick={onFinish}
          >
            Back to All Drills
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl p-6 text-white">
      {/* Progress + Score */}
      <div className="flex justify-between items-center mb-4">
        <span>
          Lesson {lessonIdx + 1} / {drill.lessons.length}
        </span>
        <span className="font-bold text-teal-400">Score: {score}</span>
      </div>

      {/* Video */}
      <div className="relative">
        <video
          ref={videoRef}
          width="100%"
          muted
          controls={false}
          onEnded={selectedOption ? handleResponseVideoEnd : handleMainVideoEnd}
          onLoadedData={() => setLoading(false)}
          className="rounded-xl"
        />
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-75 rounded-xl text-white text-lg font-semibold">
            Loading video...
          </div>
        )}

      </div>

      {/* Question + Options */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">{lesson.title}</h2>
        <p className="my-3 text-lg">{lesson.question}</p>

        {showOptions && !selectedOption && (
          <div className="space-y-3">
            {lesson.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt)}
                className="w-full py-3 px-4 bg-indigo-700 hover:bg-indigo-600 border border-pink-500 rounded-lg font-semibold text-lg"
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}

        {selectedOption && (
          <div className="mt-4 text-lg">
            {selectedOption.isCorrect ? "✅ Correct! " : "❌ Wrong! "}
            {lesson.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDrill;