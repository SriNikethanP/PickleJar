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

// Upload base64 image to Cloudinary
export const uploadBase64ImageToCloudinary = async (
  base64Data: string
): Promise<CloudinaryUploadResult> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing Cloudinary configuration. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local"
    );
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const formData = new FormData();
  formData.append("file", base64Data);
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

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
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

export const uploadMultipleImagesToCloudinary = async (
  files: File[]
): Promise<CloudinaryUploadResult[]> => {
  return Promise.all(files.map(uploadImageToCloudinary));
};

// Upload multiple base64 images to Cloudinary
export const uploadMultipleBase64ImagesToCloudinary = async (
  base64DataArray: string[]
): Promise<CloudinaryUploadResult[]> => {
  return Promise.all(base64DataArray.map(uploadBase64ImageToCloudinary));
};

// Upload multiple files as base64 to Cloudinary
export const uploadMultipleFilesAsBase64ToCloudinary = async (
  files: File[]
): Promise<CloudinaryUploadResult[]> => {
  const base64Promises = files.map(fileToBase64);
  const base64DataArray = await Promise.all(base64Promises);
  return uploadMultipleBase64ImagesToCloudinary(base64DataArray);
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
