import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
  secure: true,
});

export { cloudinary };

export async function uploadImage(
  file: string,
  folder: string,
  userId: string
) {
  return cloudinary.uploader.upload(file, {
    folder: `venturematch/${folder}`,
    public_id: `${userId}-${Date.now()}`,
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    max_bytes: 5 * 1024 * 1024, // 5MB
  });
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
