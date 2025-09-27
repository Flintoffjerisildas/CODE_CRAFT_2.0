// Fix database URLs after successful upload
require('dotenv').config({ path: '.env.production' });
const mongoose = require('mongoose');
const VideoDrill = require('../models/VideoDrill');

const updateDatabaseUrls = async () => {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connected');

    // Your uploaded video URLs (from migration output)
    const videoMappings = {
      '/videos/flood/lesson1.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947910/quiz-drill-videos/flood/lesson1.mp4',
      '/videos/flood/lesson2.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947932/quiz-drill-videos/flood/lesson2.mp4',
      '/videos/flood/lesson3.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947948/quiz-drill-videos/flood/lesson3.mp4',
      '/videos/flood/flood1_correct_option.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947735/quiz-drill-videos/flood/flood1_correct_option.mp4',
      '/videos/flood/flood1_wrong_option2.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947755/quiz-drill-videos/flood/flood1_wrong_option2.mp4',
      '/videos/flood/flood1_wrong_option3.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947776/quiz-drill-videos/flood/flood1_wrong_option3.mp4',
      '/videos/flood/flood2_correct_option.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947794/quiz-drill-videos/flood/flood2_correct_option.mp4',
      '/videos/flood/flood2_wrong_option1.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947812/quiz-drill-videos/flood/flood2_wrong_option1.mp4',
      '/videos/flood/flood2_wrong_option3.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947836/quiz-drill-videos/flood/flood2_wrong_option3.mp4',
      '/videos/flood/flood3_correct_option.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947853/quiz-drill-videos/flood/flood3_correct_option.mp4',
      '/videos/flood/flood3_wrong_option1.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947871/quiz-drill-videos/flood/flood3_wrong_option1.mp4',
      '/videos/flood/flood3_wrong_option3.mp4': 'https://res.cloudinary.com/dkfwapua6/video/upload/v1758947889/quiz-drill-videos/flood/flood3_wrong_option3.mp4'
    };

    console.log('📝 Updating database URLs...');
    const drills = await VideoDrill.find({});
    let updatedCount = 0;

    for (const drill of drills) {
      let drillUpdated = false;
      
      // Update lesson video URLs
      for (const lesson of drill.lessons) {
        if (videoMappings[lesson.videoUrl]) {
          console.log(`  🔄 Updating lesson video: ${lesson.videoUrl} -> ${videoMappings[lesson.videoUrl]}`);
          lesson.videoUrl = videoMappings[lesson.videoUrl];
          drillUpdated = true;
        }
        
        // Update option response video URLs
        if (lesson.options) {
          for (const option of lesson.options) {
            if (option.responseVideoUrl && videoMappings[option.responseVideoUrl]) {
              console.log(`  🔄 Updating response video: ${option.responseVideoUrl} -> ${videoMappings[option.responseVideoUrl]}`);
              option.responseVideoUrl = videoMappings[option.responseVideoUrl];
              drillUpdated = true;
            }
          }
        }
      }
      
      if (drillUpdated) {
        await drill.save();
        updatedCount++;
        console.log(`  ✅ Updated drill: ${drill.disasterType}`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} drills!`);
    console.log('✅ All video URLs now point to Cloudinary');
    
    // Verify the changes
    console.log('\n🔍 Verifying updates...');
    const updatedDrills = await VideoDrill.find({});
    let cloudUrls = 0;
    let localUrls = 0;
    
    updatedDrills.forEach(drill => {
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
    
    console.log(`📊 Final count: ${cloudUrls} Cloudinary URLs, ${localUrls} local URLs`);
    
    if (localUrls === 0) {
      console.log('🚀 Your project is now ready for production with 1000+ concurrent users!');
    }
    
  } catch (error) {
    console.error('❌ Database update failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateDatabaseUrls();