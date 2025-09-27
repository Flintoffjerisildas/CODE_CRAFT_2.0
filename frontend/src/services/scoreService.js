import API from "./api";

export const getGlobalLeaderboard = async () => {
  const { data } = await API.get("/scores/leaderboard");
  return data;
};

// Accepts only videoDrill, plus disasterType and points
export const saveScore = async ({ videoDrill, disasterType, points }) => {
  const { data } = await API.post("/scores", { videoDrill, disasterType, points });
  return data;
};

export const getMyScores = async () => {
  const { data } = await API.get("/scores");
  return data;
};

export const getLeaderboard = async (videoDrill) => {
  const { data } = await API.get(`/scores/leaderboard/${videoDrill}`);
  return data;
};
