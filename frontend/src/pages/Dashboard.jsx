import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyScores } from "../services/scoreService";
import api from "../services/api";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import useTranslation from "../hooks/useTranslation";
import NetworkError from "../components/NetworkError";

const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [allScores, setAllScores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        if (!user || !user.role) return;
        if (user.role === "student") {
          const data = await getMyScores();
          setScores(data);
        } else if (user.role === "teacher" || user.role === "admin") {
          const { data } = await api.get("/scores/all");
          setAllScores(data);
        }
      } catch (err) {
        setError(err);
      }
    };
    fetchScores();
  }, [user]);

  const { t } = useTranslation();
  if (!user || !user.role) return <p>{t("loading")}</p>;
  if (error?.isNetworkError || error?.isServerError) {
    return <NetworkError message={error.message} />;
  }

  if (user.role === "student") {
    // ...existing code...
    // Safely map scores for chart data
    // Prepare chart data for video drills only
    const drillScores = scores.filter(s => s.videoDrill);
    const chartData = drillScores.map(s => ({
      name: s.videoDrill?.title || (s.disasterType ? `${s.disasterType} Drill` : "Unknown"),
      score: s.points || 0,
      disasterType: s.disasterType || "Unknown",
    }));

    // Grouping removed, variable 'grouped' was unused

    // Calculate total points for video drills
    const totalDrillPoints = chartData.reduce((sum, s) => sum + s.score, 0);

    // Count attempted drills
    const attemptedDrills = chartData.length;
    const passedDrills = chartData.filter(s => s.score >= 20).length;

    return (
      <div className="p-6">
        <h1 className="text-2xl font-extrabold mb-4 text-blue-700">{t("myPerformance")}</h1>
        {scores.length === 0 ? (
          <p className="text-gray-500">{t("noScoresYet")}</p>
        ) : (
          <div className="space-y-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-8">
              <div>
                <span className="text-lg font-semibold">{t("totalDrillPoints")}: </span>
                <span className="text-blue-700 font-bold">{totalDrillPoints}</span>
              </div>
              <div>
                <span className="text-lg font-semibold">{t("attemptedDrills")}: </span>
                <span className="text-pink-700 font-bold">{attemptedDrills}</span>
              </div>
              <div>
                <span className="text-lg font-semibold">{t("passedDrills")}: </span>
                <span className="text-green-700 font-bold">{passedDrills}</span>
              </div>
            </div>
            {/* PieChart for drill scores by disaster type */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">{t("drills")} Pie Chart</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
              <ul className="mt-4">
                {chartData.map((s, idx) => (
                  <li key={idx} className="mb-2 flex items-center">
                    <span className="font-bold mr-2">{s.name}</span> <span className="text-blue-600 mx-2">{s.score} pts</span>
                    {s.score >= 20 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center ml-2"><span className="mr-1">✔️</span>Passed</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center ml-2"><span className="mr-1">❌</span>Not Passed</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* AreaChart for progress tracking */}
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={drillScores.map((s, idx) => ({ attempt: `#${idx+1}`, score: s.points }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attempt" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#2563eb" fill="#93c5fd" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  if (user.role === "teacher" || user.role === "admin") {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">📑 Student Scores Overview</h1>
        {allScores.length === 0 ? (
          <p>No student scores yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Student</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Disaster</th>
                <th className="p-2 border">Drill</th>
                <th className="p-2 border">Score</th>
              </tr>
            </thead>
            <tbody>
              {allScores.filter(s => s.videoDrill).map((s) => (
                <tr key={s._id}>
                  <td className="p-2 border">{s.user?.name || "Unknown"}</td>
                  <td className="p-2 border">{s.user?.email || "Unknown"}</td>
                  <td className="p-2 border">{s.disasterType || "-"}</td>
                  <td className="p-2 border">{s.videoDrill?.title || "-"}</td>
                  <td className="p-2 border text-center">{s.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return <p>Loading...</p>;
};

export default Dashboard;
