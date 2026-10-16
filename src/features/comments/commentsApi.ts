import { apiClient } from "../../api/client";

import type { Comment, CommentFormValues } from "./comment.types";

export const fetchCommentsRequest = async (
  storyId: string,
): Promise<Comment[]> => {
  const { data } = await apiClient.get<Comment[]>(`/comments/${storyId}/`);
  return data;
};

export const addCommentRequest = async (
  storyId: string,
  values: CommentFormValues,
): Promise<Comment> => {
  const { data } = await apiClient.post<Comment>(
    `/comments/${storyId}/add`,
    values,
  );
  return data;
};

export const addReplyRequest = async (
  storyId: string,
  parentCommentId: string,
  values: CommentFormValues,
): Promise<Comment> => {
  const { data } = await apiClient.post<Comment>(
    `/comments/${storyId}/reply/${parentCommentId}`,
    values,
  );
  return data;
};
