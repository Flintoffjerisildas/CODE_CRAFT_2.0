# Production Deployment Guide

## 1. Video Storage Migration (Do this FIRST)

### Option A: Cloudinary (Recommended - Free tier: 25GB storage)

1. Sign up at https://cloudinary.com
2. Get your credentials (cloud_name, api_key, api_secret)
3. Add to .env.production file
4. Run migration: `node backend/utils/videoMigration.js`

### Option B: AWS S3 (Scalable - Pay as you use)

- More complex setup but better for large scale
- Supports CDN distribution

### Option C: Google Cloud Storage

- Good integration with Google services
- Competitive pricing

## 2. Database Setup

1. MongoDB Atlas (recommended for production)
   - Free tier: 512MB storage
   - Automatic scaling
   - Built-in security

## 3. Concurrent Users Testing

```bash
# Install dependencies
npm install express-rate-limit helmet compression

# Load testing tools
npm install -g artillery
```

## 4. Performance Optimizations Applied

- ✅ Database indexes for faster queries
- ✅ Connection pooling (10 max connections)
- ✅ Rate limiting (100 req/15min per IP)
- ✅ Response compression
- ✅ Security headers (Helmet)
- ✅ Video streaming optimization

## 5. Deployment Platforms

### Recommended: Railway/Render (Easy)

- Automatic deployments from GitHub
- Built-in SSL certificates
- Environment variable management
- $5-10/month for production apps

### Alternative: AWS/DigitalOcean (Scalable)

- More control but complex setup
- Better for 1000+ concurrent users

## 6. Pre-deployment Checklist

- [ ] Videos migrated to cloud storage
- [ ] Database indexes created
- [ ] Environment variables set
- [ ] Rate limiting configured
- [ ] SSL certificate obtained
- [ ] Domain name configured
- [ ] Load testing completed

## 7. Load Testing Command

```bash
# Test 1000 concurrent users
artillery quick --count 1000 --num 10 https://your-app.com/api/health
```

## Estimated Costs (Monthly)

- Cloudinary (25GB): Free
- MongoDB Atlas (512MB): Free
- Railway hosting: $5-10
- Domain name: $10-15
- **Total: $15-25/month for 1000 users**
