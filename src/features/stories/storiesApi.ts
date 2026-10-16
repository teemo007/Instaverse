import { apiClient } from "../../api/client";

import type { Story, StoryInput } from "./story.types";

export const fetchStoriesRequest = async (): Promise<Story[]> => {
  const { data } = await apiClient.get<Story[]>("/stories");
  return data;
};

export const createStoryRequest = async (
  story: StoryInput,
): Promise<Story> => {
  const { data } = await apiClient.post<Story>("/stories", story);
  return data;
};

export const updateStoryRequest = async (
  storyId: string,
  story: StoryInput,
): Promise<Story> => {
  const { data } = await apiClient.patch<Story>(
    `/stories/${storyId}`,
    story,
  );
  return data;
};

export const deleteStoryRequest = async (storyId: string): Promise<void> => {
  await apiClient.delete(`/stories/${storyId}`);
};

export const likeStoryRequest = async (storyId: string): Promise<Story> => {
  const { data } = await apiClient.patch<Story>(
    `/stories/${storyId}/likeStroy`,
  );
  return data;
};
