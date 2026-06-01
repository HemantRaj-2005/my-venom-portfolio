import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resourceType?: "image" | "raw" | "video" | "auto";
    publicId?: string;
    format?: string;
  } = {}
): Promise<UploadResult> {
  try {
    const { folder = "portfolio", resourceType = "auto", publicId, format } = options;

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: publicId,
          format,
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Upload failed";
    console.error("Cloudinary upload error:", message);
    return { success: false, error: message };
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Delete failed";
    console.error("Cloudinary delete error:", message);
    return { success: false, error: message };
  }
}

export function getCloudinaryPublicId(url: string): string | null {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    // Skip version if present (v1234...)
    const afterUpload = parts.slice(uploadIndex + 1);
    const startIndex = afterUpload[0]?.startsWith("v") ? 1 : 0;
    const pathParts = afterUpload.slice(startIndex);
    const fullPath = pathParts.join("/");
    // Remove extension
    return fullPath.replace(/\.[^.]+$/, "");
  } catch {
    return null;
  }
}

export { cloudinary };
