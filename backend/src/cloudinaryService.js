import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with secure=false for SSL issues
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: false // Return HTTP URLs instead of HTTPS
});

// Upload image to Cloudinary
export const uploadImage = async (imageBuffer, filename) => {
  try {
    // Convert buffer to base64
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'pergunu/news',
      public_id: filename,
      resource_type: 'image',
      overwrite: true
    });
    
    // Return HTTP URL (url) instead of HTTPS (secure_url) for SSL issues
    console.log('✅ Cloudinary upload success:', result.url);
    return result.url;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(`pergunu/news/${publicId}`);
    console.log('🗑️ Cloudinary delete success:', publicId);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinary;
