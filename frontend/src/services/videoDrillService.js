import API from "./api";

export const getAllVideoDrills = async () => {
  const { data } = await API.get("/video-drills");
  return data;
};

export const getDrillByDisasterType = async (disasterType) => {
  const { data } = await API.get(`/video-drills/type/${disasterType}`);
  return data;
};