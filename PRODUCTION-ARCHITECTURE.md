# Production Deployment Architecture

## 🚀 Proper Production Setup (NOT using concurrently)

### Current Issue:

```json
// ❌ NEVER use this in production
"scripts": {
  "dev": "concurrently \"npm run dev --prefix backend\" \"npm start --prefix frontend\""
}
```

## ✅ Correct Production Architecture

### Option 1: Separate Deployments (Recommended)

#### Backend Deployment:

```bash
# Backend runs on its own server/container
PORT=5000 NODE_ENV=production node backend/server.js
```

#### Frontend Deployment:

```bash
# Frontend gets built and served as static files
cd frontend
npm run build
# Serve build/ folder via nginx, Netlify, Vercel, etc.
```

### Option 2: Same Server (Budget Option)

#### Backend (API Server):

```bash
# Runs on port 5000
cd backend
NODE_ENV=production node server.js
```

#### Frontend (Static Files):

```bash
# Built files served via Express static middleware
# Added to your backend server.js
app.use(express.static(path.join(__dirname, '../frontend/build')));
```

## 🏗️ Production Deployment Options

### Option A: Railway (Recommended - Easy)

- **Backend**: Deploy backend/ as Node.js service
- **Frontend**: Deploy frontend/ as static site OR build and serve via backend
- **Cost**: $5/month backend + $0 frontend static
- **Scaling**: Automatic

### Option B: Render (Easy + Free Tier)

- **Backend**: Web service (free tier available)
- **Frontend**: Static site (free)
- **Cost**: Free tier available
- **Scaling**: Manual upgrade

### Option C: Netlify + Heroku

- **Backend**: Heroku (free tier deprecated, $7/month)
- **Frontend**: Netlify (free for static)
- **Cost**: $7/month
- **Scaling**: Good

### Option D: AWS (Advanced)

- **Backend**: EC2 or ECS
- **Frontend**: S3 + CloudFront CDN
- **Cost**: $10-50/month depending on usage
- **Scaling**: Excellent but complex

### Option E: DigitalOcean (Balanced)

- **Backend**: App Platform or Droplet
- **Frontend**: Static hosting or same droplet
- **Cost**: $5-12/month
- **Scaling**: Good with manual setup

## 🎯 Recommended Production Scripts

### Root package.json:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm start --prefix frontend\"",
    "build": "npm run build --prefix frontend",
    "start": "cd backend && NODE_ENV=production node server.js",
    "build:frontend": "cd frontend && npm run build",
    "deploy:backend": "cd backend && npm run production",
    "deploy:frontend": "cd frontend && npm run build && npm run deploy"
  }
}
```

### Backend package.json:

```json
{
  "scripts": {
    "start": "NODE_ENV=production node server.js",
    "dev": "nodemon server.js",
    "production": "NODE_ENV=production pm2 start server.js --name quiz-backend"
  }
}
```

### Frontend package.json:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "deploy": "npm run build && netlify deploy --prod --dir=build"
  }
}
```

## 🔧 Production Process Manager

### PM2 (Recommended for Backend)

```bash
# Install PM2
npm install -g pm2

# Start backend with PM2
cd backend
NODE_ENV=production pm2 start server.js --name quiz-backend

# Monitor
pm2 monit

# Auto-restart on server reboot
pm2 startup
pm2 save
```

## 📊 Load Testing for Production

### Test Backend Only (Production Way):

```bash
# Test your deployed backend API
artillery quick --count 1000 --num 10 https://your-backend.com/api/health
```

### Test Full App:

```bash
# Test complete user journey
artillery quick --count 100 --num 5 https://your-frontend.com
```

## 🚨 Never Do These in Production:

❌ `concurrently` for production
❌ `npm start` for React (development server)
❌ `nodemon` in production
❌ Serving both from same port/process
❌ Development environment variables
❌ Unbuilt React code in production

## ✅ Production Best Practices:

✅ Separate backend and frontend deployments
✅ Build React app (`npm run build`)
✅ Use production environment variables
✅ Process manager (PM2) for backend
✅ CDN for static assets
✅ Health check endpoints
✅ Monitoring and logging
✅ SSL certificates
✅ Rate limiting and security headers
