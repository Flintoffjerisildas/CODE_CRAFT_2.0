import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getScenarioById } from "../services/scenarioService";
import { saveScore } from "../services/scoreService";
// import { completeAssessment } from "../services/assessmentService";
import QuestionOverlay from "../components/QuestionOverlay";

const ScenarioPlayer = () => {
  const { scenarioId } = useParams();
  // ...existing code...
  const [scenario, setScenario] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  // Get assessmentId and onFinish callback from navigation state
  // const assessmentId = location.state?.assessmentId;

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const data = await getScenarioById(scenarioId);
        setScenario(data);
        if (data.questions.length > 0) {
          setCurrentQuestion(data.questions[0]);
        }
      } catch (err) {
        console.error("Failed to load scenario:", err);
      }
    };
    fetchScenario();
  }, [scenarioId]);

  const handleAnswer = (index) => {
    let updatedScore = score;
    if (index === currentQuestion.correctIndex) {
      updatedScore += 10;
    }
    setScore(updatedScore);

    const nextStep = step + 1;
    if (scenario.questions[nextStep]) {
      setStep(nextStep);
      setCurrentQuestion(scenario.questions[nextStep]);
    } else {
      // Drill complete
      saveScore(scenarioId, updatedScore)
        .then(() => setCompleted(true))
        .catch((err) => {
          console.error("Error saving score:", err);
          setCompleted(true);
        });
    }
  };

  if (!scenario) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{scenario.title}</h2>
      <p className="mb-4">{scenario.description}</p>

      {!completed && currentQuestion ? (
        <QuestionOverlay question={currentQuestion} onAnswer={handleAnswer} />
      ) : (
        <div className="p-6 border rounded shadow text-center bg-green-50">
          <h3 className="text-lg font-bold mb-2">✅ Drill Completed!</h3>
          <p className="text-xl mb-4">Your Score: {score}</p>
          <div className="flex justify-center gap-4">
            <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded">
              Go to Dashboard
            </Link>
            {scenario?.drill?._id && (
              <Link to={`/leaderboard/${scenario.drill._id}`} className="px-4 py-2 bg-gray-600 text-white rounded">
                View Leaderboard
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioPlayer;
