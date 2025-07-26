import { v2 as cloudinary } from "cloudinary";
import { validateCloudinaryConfig } from "@lib/config/cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

export const uploadImageToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResult> => {
  try {
    // Validate configuration
    if (!validateCloudinaryConfig()) {
      throw new Error(
        "Cloudinary configuration is missing. Please check your environment variables."
      );
    }

    // Convert File to base64
    const base64 = await fileToBase64(file);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          base64,
          {
            folder: "picklejar/products",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto", fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                url: result.url,
                width: result.width,
                height: result.height,
                format: result.format,
              });
            }
          }
        );
      }
    );

    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export const uploadMultipleImagesToCloudinary = async (
  files: File[]
): Promise<CloudinaryUploadResult[]> => {
  try {
    // Validate configuration
    if (!validateCloudinaryConfig()) {
      throw new Error(
        "Cloudinary configuration is missing. Please check your environment variables."
      );
    }

    const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error uploading multiple images to Cloudinary:", error);
    throw new Error("Failed to upload images to Cloudinary");
  }
};

export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    // Validate configuration
    if (!validateCloudinaryConfig()) {
      throw new Error(
        "Cloudinary configuration is missing. Please check your environment variables."
      );
    }

    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to get Cloudinary URL with transformations
export const getCloudinaryUrl = (
  publicId: string,
  transformations?: string
): string => {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const transformPath = transformations ? `/${transformations}` : "";
  return `${baseUrl}${transformPath}/${publicId}`;
};
