// backend/config/production.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

const setupProduction = (app) => {
  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        mediaSrc: ["'self'", "https:"],
      },
    },
  }));

  // Compression middleware
  app.use(compression());

  // Rate limiting for concurrent users
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
  });

  // Video streaming rate limiting
  const videoLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 video requests per minute
    message: 'Too many video requests, please slow down.',
  });

  // Apply rate limiters
  app.use('/api/', generalLimiter);
  app.use('/api/auth/', authLimiter);
  app.use('/api/video-drills/', videoLimiter);
  app.use('/uploads/videos/', videoLimiter);

  // Trust proxy (important for rate limiting behind reverse proxy)
  app.set('trust proxy', 1);

  return app;
};

module.exports = setupProduction;