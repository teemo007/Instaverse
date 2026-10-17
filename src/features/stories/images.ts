import axios from "axios";

import { apiClient } from "../../api/client";

interface UploadAuthorization {
  token: string;
  expire: number;
  fields: Record<string, string>;
}

interface UploadResult {
  url?: string;
  fileId?: string;
  fileType?: string;
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const IMAGE_ACCEPT = allowedTypes.join(",");

export const validateImageFile = (file: File): void => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Choose a JPEG, PNG, WebP, GIF or AVIF image.");
  }
  if (file.size === 0 || file.size > 5 * 1024 * 1024) {
    throw new Error("Choose a non-empty image up to 5 MB.");
  }
};

export const uploadStoryImage = async (
  file: File,
): Promise<{ image: string; imageFileId: string }> => {
  validateImageFile(file);
  const { data: auth } = await apiClient.post<UploadAuthorization>("/images/upload-auth", {
    type: file.type, size: file.size,
  });
  const body = new FormData();
  body.append("file", file);
  body.append("token", auth.token);
  for (const [key, value] of Object.entries(auth.fields)) body.append(key, value);

  // Use plain Axios so the application's JWT is never sent to ImageKit.
  const { data } = await axios.post<UploadResult>(
    "https://upload.imagekit.io/api/v2/files/upload", body, { timeout: 120000 },
  );
  if (!data.fileId || !data.url?.startsWith("https://") || data.fileType !== "image") {
    throw new Error("The image upload did not return a valid image. Please try again.");
  }
  return { image: data.url, imageFileId: data.fileId };
};

export const getStoryImageUrl = (image: string, imageFileId?: string): string => {
  if (!imageFileId || !image.startsWith("https://")) return image;
  const url = new URL(image);
  url.searchParams.set("tr", "w-800,q-80,f-auto");
  return url.toString();
};
