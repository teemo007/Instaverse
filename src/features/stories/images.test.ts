import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../../api/client";
import { getStoryImageUrl, uploadStoryImage, validateImageFile } from "./images";

afterEach(() => vi.restoreAllMocks());

describe("story images", () => {
  it("rejects unsupported and oversized files before requesting upload credentials", () => {
    expect(() => validateImageFile(new File(["svg"], "image.svg", { type: "image/svg+xml" }))).toThrow();
    expect(() => validateImageFile(new File([new Uint8Array(5242881)], "large.jpg", { type: "image/jpeg" }))).toThrow();
    expect(() => validateImageFile(new File([], "empty.png", { type: "image/png" }))).toThrow();
  });

  it("uploads binary data directly to ImageKit, keeping JWT headers off the upload request", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValue({ data: {
      token: "signed-jwt", expire: 123456,
      fields: { folder: "/instaverse/stories/user-1", fileName: "generated.png", overwriteFile: "false" },
    } });
    const post = vi.spyOn(axios, "post").mockResolvedValue({ data: {
      url: "https://ik.imagekit.io/test/photo.jpg", fileId: "file-1", fileType: "image", width: 800, height: 600,
    } });
    const file = new File(["png"], "photo.png", { type: "image/png" });
    const result = await uploadStoryImage(file);
    expect(result).toEqual({ image: "https://ik.imagekit.io/test/photo.jpg", imageFileId: "file-1" });
    expect(post.mock.calls[0][0]).toBe("https://upload.imagekit.io/api/v2/files/upload");
    const body = post.mock.calls[0][1] as FormData;
    expect(body.get("file")).toBeInstanceOf(File);
    expect(body.get("fileName")).toBe("generated.png");
    expect(body.get("token")).toBe("signed-jwt");
    expect(body.get("folder")).toBe("/instaverse/stories/user-1");
    expect(body.get("overwriteFile")).toBe("false");
    expect(post.mock.calls[0][2]?.headers ?? {}).not.toHaveProperty("Authorization");
  });

  it("does not publish malformed upload responses", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValue({ data: { token: "signed", fields: { folder: "/test" } } });
    vi.spyOn(axios, "post").mockResolvedValue({ data: { url: "data:image/png;base64,bad" } });
    await expect(uploadStoryImage(new File(["png"], "photo.png", { type: "image/png" }))).rejects.toThrow();
  });

  it("optimizes ImageKit images while preserving original preview URLs and legacy images", () => {
    const image = "https://ik.imagekit.io/test/photo.jpg";
    expect(new URL(getStoryImageUrl(image, "file-1")).searchParams.get("tr")).toBe("w-800,q-80,f-auto");
    expect(new URL(getStoryImageUrl(`${image}?v=1`, "file-1")).searchParams.get("v")).toBe("1");
    expect(getStoryImageUrl("data:image/png;base64,legacy")).toBe("data:image/png;base64,legacy");
    expect(getStoryImageUrl("https://example.com/old.jpg")).toBe("https://example.com/old.jpg");
  });
});
