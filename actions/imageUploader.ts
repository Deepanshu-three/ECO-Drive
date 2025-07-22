"use server";

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFromBuffer = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};


// MULTIPLE IMAGE UPLOAD
export async function uploadMultipleImagesAction(formData: FormData) {
  try {
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return { success: false, message: "No files uploaded" };
    }

    if (files.length > 5) {
      return { success: false, message: "Maximum 5 files allowed" };
    }

    const uploadPromises = files.map(async (file) => {
      if (file.size > 50 * 1024 * 1024) {
        throw new Error("File too large");
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      return uploadFromBuffer(buffer);
    });

    const imageUrls = await Promise.all(uploadPromises);

    return { success: true, imageUrls };
  } catch (error: any) {
    console.error("Upload failed:", error);
    return { success: false, message: "Upload failed" };
  }
}

// SINGLE IMAGE UPLOAD
export async function uploadSingleImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, message: "No file uploaded" };
    }

    if (file.size > 50 * 1024 * 1024) {
      return { success: false, message: "File too large" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await uploadFromBuffer(buffer);

    return { success: true, imageUrl };
  } catch (error: any) {
    console.error("Single upload failed:", error);
    return { success: false, message: "Upload failed" };
  }
}
