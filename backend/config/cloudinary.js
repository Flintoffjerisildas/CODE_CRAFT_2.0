// backend/config/cloudinary.js - Video storage solution
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (supports up to 1GB video files)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload video to Cloudinary
const uploadVideo = async (filePath, publicId) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      public_id: publicId,
      format: 'mp4',
      quality: 'auto:good',
      // Removed streaming profile - use simple optimization
      transformation: [
        { quality: 'auto:good', format: 'mp4' }
      ]
    });
    return result;
  } catch (error) {
    console.error('Video upload error:', error);
    throw error;
  }
};

// Get optimized video URL
const getVideoUrl = (publicId, quality = 'auto') => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    quality: quality,
    format: 'mp4',
    secure: true
  });
};

module.exports = {
  cloudinary,
  uploadVideo,
  getVideoUrl
};