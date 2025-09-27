#!/bin/bash
# deploy-production.sh - Production deployment script

echo "🚀 Starting production deployment..."

# Step 1: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production

# Step 2: Build frontend
echo "⚛️ Building React frontend..."
cd ../frontend
npm install
npm run build

# Step 3: Copy build to backend (for single-server deployment)
echo "📁 Copying frontend build to backend..."
cp -r build ../backend/

# Step 4: Test production build locally (optional)
echo "🧪 Testing production build..."
cd ../backend
NODE_ENV=production node server.js &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test health endpoint
curl -f http://localhost:5000/api/health || {
  echo "❌ Health check failed"
  kill $SERVER_PID
  exit 1
}

echo "✅ Health check passed"
kill $SERVER_PID

echo "🎉 Production build ready!"
echo "💡 Deploy the backend/ folder to your hosting service"
echo "📋 Make sure to set NODE_ENV=production on your hosting platform"