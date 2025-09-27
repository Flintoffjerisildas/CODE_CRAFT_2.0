// backend/utils/videoMigration.js - Migrate local videos to cloud
// Load environment variables FIRST
require('dotenv').config({ path: '.env.production' }); 

const fs = require('fs');
const path = require('path');
const { uploadVideo, getVideoUrl } = require('../config/cloudinary');
const VideoDrill = require('../models/VideoDrill');

const migrateVideosToCloud = async () => {
  try {
    console.log('🚀 Starting video migration to Cloudinary...');
    console.log(`Using Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    
    const videoDir = path.join(__dirname, '../uploads/videos');
    
    if (!fs.existsSync(videoDir)) {
      console.error('❌ Video directory not found:', videoDir);
      return;
    }
    
    const disasterTypes = fs.readdirSync(videoDir);
    console.log(`📁 Found disaster types: ${disasterTypes.join(', ')}`);
    
    for (const disasterType of disasterTypes) {
      const disasterPath = path.join(videoDir, disasterType);
      if (!fs.statSync(disasterPath).isDirectory()) continue;
      
      console.log(`\n🌊 Processing ${disasterType} videos...`);
      const videoFiles = fs.readdirSync(disasterPath);
      
      // Filter only .mp4 files
      const mp4Files = videoFiles.filter(file => file.endsWith('.mp4'));
      console.log(`  Found ${mp4Files.length} MP4 files`);
      
      for (const videoFile of mp4Files) {
        const localPath = path.join(disasterPath, videoFile);
        const publicId = `quiz-drill-videos/${disasterType}/${videoFile.replace('.mp4', '')}`;
        
        try {
          console.log(`  📤 Uploading: ${videoFile}...`);
          const result = await uploadVideo(localPath, publicId);
          
          // Update database with cloud URL
          await updateVideoUrls(disasterType, videoFile, result.secure_url, publicId);
          
          console.log(`  ✅ Success: ${videoFile} -> ${result.secure_url}`);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`  ❌ Failed: ${videoFile} - ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 Video migration completed!');
    console.log('\n📊 Summary:');
    await printMigrationSummary();
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
};

const updateVideoUrls = async (disasterType, filename, cloudUrl, publicId) => {
  try {
    // Find video drill by disaster type
    const drills = await VideoDrill.find({ disasterType });
    
    for (const drill of drills) {
      let updated = false;
      
      // Update lesson video URLs
      drill.lessons.forEach(lesson => {
        if (lesson.videoUrl.includes(filename)) {
          const oldUrl = lesson.videoUrl;
          lesson.videoUrl = cloudUrl;
          console.log(`    📝 Updated lesson: ${oldUrl} -> ${cloudUrl}`);
          updated = true;
        }
        
        // Update option response video URLs
        if (lesson.options) {
          lesson.options.forEach(option => {
            if (option.responseVideoUrl && option.responseVideoUrl.includes(filename)) {
              const oldUrl = option.responseVideoUrl;
              option.responseVideoUrl = cloudUrl;
              console.log(`    📝 Updated option: ${oldUrl} -> ${cloudUrl}`);
              updated = true;
            }
          });
        }
      });
      
      if (updated) {
        await drill.save();
        console.log(`    💾 Saved drill: ${drill._id}`);
      }
    }
  } catch (error) {
    console.error('    ❌ Database update error:', error.message);
  }
};

const printMigrationSummary = async () => {
  try {
    const drills = await VideoDrill.find({});
    console.log(`Total drills in database: ${drills.length}`);
    
    let cloudUrls = 0;
    let localUrls = 0;
    
    drills.forEach(drill => {
      drill.lessons.forEach(lesson => {
        if (lesson.videoUrl.includes('cloudinary.com')) {
          cloudUrls++;
        } else {
          localUrls++;
        }
        
        if (lesson.options) {
          lesson.options.forEach(option => {
            if (option.responseVideoUrl) {
              if (option.responseVideoUrl.includes('cloudinary.com')) {
                cloudUrls++;
              } else {
                localUrls++;
              }
            }
          });
        }
      });
    });
    
    console.log(`Cloud URLs: ${cloudUrls}`);
    console.log(`Local URLs: ${localUrls}`);
    console.log(`Migration ${localUrls === 0 ? 'COMPLETE! 🎉' : 'INCOMPLETE ⚠️'}`);
    
  } catch (error) {
    console.error('Summary error:', error.message);
  }
};

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const { cloudinary } = require('../config/cloudinary');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection test:', result.status);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

// Run migration if called directly
if (require.main === module) {
  testCloudinaryConnection().then(connected => {
    if (connected) {
      migrateVideosToCloud();
    } else {
      console.log('Please check your Cloudinary credentials in .env file');
    }
  });
}

module.exports = { migrateVideosToCloud, testCloudinaryConnection };