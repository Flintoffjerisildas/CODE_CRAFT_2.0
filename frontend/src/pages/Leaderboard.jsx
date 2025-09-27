// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { getLeaderboard, getGlobalLeaderboard } from "../services/scoreService";
import { useParams } from "react-router-dom";
import useTranslation from "../hooks/useTranslation";
import NetworkError from "../components/NetworkError";

const Leaderboard = () => {
  const { drillId } = useParams();
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        let data;
        if (drillId) {
          data = await getLeaderboard(drillId);
        } else {
          data = await getGlobalLeaderboard();
        }
        setLeaders(data);
      } catch (err) {
        setError(err);
      }
    };
    fetchLeaders();
  }, [drillId]);

  const { t } = useTranslation();
  if (error?.isNetworkError || error?.isServerError) {
    return <NetworkError message={error.message} />;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t("leaderboard")}</h1>
      <ol className="space-y-2">
        {leaders.filter(l => l.videoDrill).map((l, idx) => (
          <li
            key={l._id}
            className="p-3 border rounded-lg flex flex-col md:flex-row justify-between items-center bg-white shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center">
              <span className="font-semibold text-lg mr-2">
                #{idx + 1} {l.user?.name || l.user?.email || l.user || t("unknownUser")}
              </span>
              {l.user?.email && l.user?.name !== l.user?.email && (
                <span className="ml-2 text-gray-500 text-sm">({l.user.email})</span>
              )}
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                {l.disasterType || "-"}
              </span>
              <span className="ml-2 text-gray-700 text-sm">
                {l.videoDrill?.title || "-"}
              </span>
            </div>
            <span className="font-semibold text-green-700 text-lg">{l.points} {t("points")}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;