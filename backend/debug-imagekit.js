// Debug ImageKit API calls
const imagekit = require('./config/imagekit');

async function debugImageKit() {
  console.log('🔍 Debugging ImageKit API...\n');
  
  try {
    console.log('1️⃣ Testing direct listFiles call...');
    const files = await imagekit.listFiles({
      path: '/banners',
      limit: 10
    });
    console.log('✅ Direct API call successful!');
    console.log('Files:', JSON.stringify(files, null, 2));
    
  } catch (error) {
    console.error('❌ Direct API call failed:', error);
    
    // Try without path filter
    try {
      console.log('\n2️⃣ Testing listFiles without path filter...');
      const allFiles = await imagekit.listFiles({
        limit: 5
      });
      console.log('✅ List all files successful!');
      console.log('Files:', JSON.stringify(allFiles, null, 2));
      
    } catch (error2) {
      console.error('❌ List all files failed:', error2);
    }
  }
}

debugImageKit();