export interface CloudinaryUploadResult {
  secure_url: string;
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export const uploadImageToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResult> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing Cloudinary configuration. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local"
    );
  }

  // Always use the standard Cloudinary upload API
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to upload image to Cloudinary: ${res.status} ${res.statusText} - ${errorText}`
    );
  }

  const data = await res.json();
  return {
    secure_url: data.secure_url,
    url: data.url,
    public_id: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
};

export const uploadMultipleImagesToCloudinary = async (
  files: File[]
): Promise<CloudinaryUploadResult[]> => {
  return Promise.all(files.map(uploadImageToCloudinary));
};

// Helper function to get Cloudinary URL with transformations
export const getCloudinaryUrl = (
  publicId: string,
  transformations?: string
): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  }
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const transformPath = transformations ? `/${transformations}` : "";
  return `${baseUrl}${transformPath}/${publicId}`;
};
