module.exports = function extractImageKitFileId(url) {
  if (!url) return null;
  
  // ImageKit URLs typically have format: https://ik.imagekit.io/your_imagekit_id/path/filename.ext
  // We need to extract the path after the imagekit_id
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Remove the first empty part and imagekit_id
    if (pathParts.length >= 3) {
      // Join the remaining path parts to get the file path
      return pathParts.slice(2).join('/');
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting ImageKit file ID:', error);
    return null;
  }
};