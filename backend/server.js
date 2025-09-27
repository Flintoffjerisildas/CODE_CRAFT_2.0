const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

// Load environment-specific config
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}

connectDB();

const app = express();

// Production security and performance middleware
if (process.env.NODE_ENV === 'production') {
  const helmet = require('helmet');
  const compression = require('compression');
  const rateLimit = require('express-rate-limit');
  
  app.use(helmet());
  app.use(compression());
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use(limiter);
  
  // Trust proxy (for Railway, Render, etc.)
  app.set('trust proxy', 1);
}

// CORS configuration for Vercel frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-app.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // parse JSON
app.use('/uploads/videos', express.static(path.join(__dirname, '/uploads/videos')));

const assessmentRoutes = require('./routes/assessmentRoutes');
// Serve videos statically
app.use("/videos", express.static(path.join(__dirname, "uploads/videos")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/scenarios", require("./routes/scenarioRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/video-scenarios", require("./routes/videoScenarioRoutes"));
app.use("/api/video-drills", require("./routes/videoDrillRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use('/api/assessment', assessmentRoutes);
app.use('/api/test', require('./routes/testRoutes')); // Test routes for debugging

// Health check endpoint for load testing
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Production: Serve React build files (if frontend is built and placed in backend)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('✅ Production mode: Security & performance optimizations active');
    console.log('📁 Serving React build files from /build');
  }
});

// Example of a video URL
const videoUrl = `http://localhost:${PORT}/videos/myvideo.mp4`;