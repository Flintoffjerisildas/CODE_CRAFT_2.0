// Test Cloudinary connection
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.production' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testConnection = async () => {
  try {
    console.log('🔍 Testing Cloudinary connection...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY?.substring(0, 8) + '...');
    
    // Test API connection
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
    
    // Test upload capability (small test)
    console.log('\n🧪 Testing upload capability...');
    const testUpload = await cloudinary.uploader.upload(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      {
        resource_type: 'image',
        public_id: 'test-connection',
        folder: 'disaster-management/test'
      }
    );
    
    console.log('✅ Upload capability confirmed!');
    console.log('Test URL:', testUpload.secure_url);
    
    // Clean up test file
    await cloudinary.uploader.destroy('disaster-management/test/test-connection');
    console.log('🧹 Test file cleaned up');
    
    console.log('\n🎉 Ready to migrate your videos!');
    
  } catch (error) {
    console.error('❌ Cloudinary connection failed:');
    console.error('Error:', error.message);
    console.error('\n🔧 Check your credentials in .env file');
  }
};

testConnection();