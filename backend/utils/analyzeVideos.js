// backend/utils/analyzeVideos.js - Analyze current video structure
require('dotenv').config({ path: '.env.production' });
const fs = require('fs');
const path = require('path');
const VideoDrill = require('../models/VideoDrill');

const analyzeCurrentVideos = async () => {
  console.log('🔍 Analyzing current video structure...\n');
  
  // 1. Check local video files
  const videoDir = path.join(__dirname, '../uploads/videos');
  
  if (fs.existsSync(videoDir)) {
    console.log('📁 LOCAL VIDEO FILES:');
    const disasterTypes = fs.readdirSync(videoDir);
    
    for (const disasterType of disasterTypes) {
      const disasterPath = path.join(videoDir, disasterType);
      if (fs.statSync(disasterPath).isDirectory()) {
        const videoFiles = fs.readdirSync(disasterPath).filter(f => f.endsWith('.mp4'));
        console.log(`  ${disasterType}/: ${videoFiles.length} videos`);
        videoFiles.forEach(file => {
          const filePath = path.join(disasterPath, file);
          const stats = fs.statSync(filePath);
          const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
          console.log(`    - ${file} (${sizeMB} MB)`);
        });
      }
    }
  } else {
    console.log('❌ No local video directory found');
  }
  
  // 2. Check database video drill structure
  try {
    await require('../config/db')(); // Connect to database
    
    console.log('\n📊 DATABASE VIDEO DRILLS:');
    const drills = await VideoDrill.find({});
    
    for (const drill of drills) {
      console.log(`\n🎯 Drill: ${drill.disasterType} (${drill._id})`);
      console.log(`   Title: ${drill.title || 'No title'}`);
      console.log(`   Lessons: ${drill.lessons.length}`);
      
      drill.lessons.forEach((lesson, index) => {
        console.log(`   Lesson ${index + 1}: ${lesson.title}`);
        console.log(`     Video: ${lesson.videoUrl}`);
        
        if (lesson.options && lesson.options.length > 0) {
          console.log(`     Options: ${lesson.options.length}`);
          lesson.options.forEach((option, optIndex) => {
            console.log(`       ${optIndex + 1}. ${option.text} ${option.isCorrect ? '✅' : '❌'}`);
            if (option.responseVideoUrl) {
              console.log(`          Response: ${option.responseVideoUrl}`);
            }
          });
        }
      });
    }
    
    // 3. Analyze URL types
    console.log('\n📈 URL ANALYSIS:');
    let localUrls = 0;
    let cloudUrls = 0;
    let brokenUrls = 0;
    
    drills.forEach(drill => {
      drill.lessons.forEach(lesson => {
        if (lesson.videoUrl.includes('cloudinary.com')) {
          cloudUrls++;
        } else if (lesson.videoUrl.includes('localhost') || lesson.videoUrl.startsWith('/')) {
          localUrls++;
        } else {
          brokenUrls++;
        }
        
        if (lesson.options) {
          lesson.options.forEach(option => {
            if (option.responseVideoUrl) {
              if (option.responseVideoUrl.includes('cloudinary.com')) {
                cloudUrls++;
              } else if (option.responseVideoUrl.includes('localhost') || option.responseVideoUrl.startsWith('/')) {
                localUrls++;
              } else {
                brokenUrls++;
              }
            }
          });
        }
      });
    });
    
    console.log(`   Cloud URLs (ready for production): ${cloudUrls}`);
    console.log(`   Local URLs (need migration): ${localUrls}`);
    console.log(`   Broken URLs: ${brokenUrls}`);
    
    if (localUrls > 0) {
      console.log('\n⚠️  You need to run migration to move videos to cloud!');
      console.log('   Run: npm run migration');
    } else if (cloudUrls > 0) {
      console.log('\n✅ All videos are in cloud storage - ready for production!');
    }
    
  } catch (error) {
    console.error('Database analysis failed:', error.message);
  } finally {
    process.exit(0);
  }
};

// Run analysis if called directly
if (require.main === module) {
  analyzeCurrentVideos();
}

module.exports = { analyzeCurrentVideos };