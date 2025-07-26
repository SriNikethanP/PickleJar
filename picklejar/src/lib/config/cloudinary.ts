// Cloudinary Configuration
// Add these environment variables to your .env.local file:

/*
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
*/

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

// Validate configuration
export const validateCloudinaryConfig = () => {
  const missingVars = [];

  if (!CLOUDINARY_CONFIG.cloudName) {
    missingVars.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  }
  if (!CLOUDINARY_CONFIG.apiKey) {
    missingVars.push("NEXT_PUBLIC_CLOUDINARY_API_KEY");
  }
  if (!CLOUDINARY_CONFIG.apiSecret) {
    missingVars.push("CLOUDINARY_API_SECRET");
  }

  if (missingVars.length > 0) {
    console.error("Missing Cloudinary environment variables:", missingVars);
    console.error("Please add these to your .env.local file");
    return false;
  }

  return true;
};
