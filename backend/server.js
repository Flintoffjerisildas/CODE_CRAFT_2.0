const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/scenarios", require("./routes/scenarioRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
