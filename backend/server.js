const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON
app.use('/uploads/videos', express.static(path.join(__dirname, '/uploads/videos')));

// Serve videos statically
app.use("/videos", express.static(path.join(__dirname, "uploads/videos")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/scenarios", require("./routes/scenarioRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/video-scenarios", require("./routes/videoScenarioRoutes"));
app.use("/api/video-drills", require("./routes/videoDrillRoutes"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Example of a video URL
const videoUrl = `http://localhost:${PORT}/videos/myvideo.mp4`;