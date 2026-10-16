import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { AppError, AsyncStatus } from "../../api/api.types";
import { normalizeApiError } from "../../api/errors";
import {
  addCommentRequest,
  addReplyRequest,
  fetchCommentsRequest,
} from "./commentsApi";
import type { Comment, CommentFormValues } from "./comment.types";

export interface CommentsState {
  byStoryId: Record<string, Comment[]>;
  statusByStoryId: Record<string, AsyncStatus>;
  errorByStoryId: Record<string, AppError | null>;
}

export interface AddCommentArgs extends CommentFormValues {
  storyId: string;
}

export interface AddReplyArgs extends CommentFormValues {
  storyId: string;
  parentCommentId: string;
}

const initialState: CommentsState = {
  byStoryId: {},
  statusByStoryId: {},
  errorByStoryId: {},
};

export const fetchComments = createAsyncThunk<
  Comment[],
  string,
  { rejectValue: AppError }
>("comments/fetchComments", async (storyId, { rejectWithValue }) => {
  try {
    return await fetchCommentsRequest(storyId);
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const addComment = createAsyncThunk<
  Comment,
  AddCommentArgs,
  { rejectValue: AppError }
>("comments/addComment", async ({ storyId, content }, { rejectWithValue }) => {
  try {
    return await addCommentRequest(storyId, { content });
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const addReply = createAsyncThunk<
  Comment,
  AddReplyArgs,
  { rejectValue: AppError }
>(
  "comments/addReply",
  async ({ storyId, parentCommentId, content }, { rejectWithValue }) => {
    try {
      return await addReplyRequest(storyId, parentCommentId, { content });
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

const setPending = (state: CommentsState, storyId: string): void => {
  state.statusByStoryId[storyId] = "loading";
  state.errorByStoryId[storyId] = null;
};

const setRejected = (
  state: CommentsState,
  storyId: string,
  error: AppError,
): void => {
  state.statusByStoryId[storyId] = "failed";
  state.errorByStoryId[storyId] = error;
};

const setSucceeded = (state: CommentsState, storyId: string): void => {
  state.statusByStoryId[storyId] = "succeeded";
  state.errorByStoryId[storyId] = null;
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        setPending(state, action.meta.arg);
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const storyId = action.meta.arg;
        state.byStoryId[storyId] = action.payload;
        setSucceeded(state, storyId);
      })
      .addCase(fetchComments.rejected, (state, action) => {
        setRejected(
          state,
          action.meta.arg,
          action.payload ?? normalizeApiError(action.error),
        );
      })
      .addCase(addComment.pending, (state, action) => {
        setPending(state, action.meta.arg.storyId);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const storyId = action.meta.arg.storyId;
        state.byStoryId[storyId] ??= [];
        state.byStoryId[storyId].push(action.payload);
        setSucceeded(state, storyId);
      })
      .addCase(addComment.rejected, (state, action) => {
        setRejected(
          state,
          action.meta.arg.storyId,
          action.payload ?? normalizeApiError(action.error),
        );
      })
      .addCase(addReply.pending, (state, action) => {
        setPending(state, action.meta.arg.storyId);
      })
      .addCase(addReply.fulfilled, (state, action) => {
        const { storyId, parentCommentId } = action.meta.arg;
        state.byStoryId[storyId] ??= [];
        state.byStoryId[storyId].push({
          ...action.payload,
          parentId: parentCommentId,
        });
        setSucceeded(state, storyId);
      })
      .addCase(addReply.rejected, (state, action) => {
        setRejected(
          state,
          action.meta.arg.storyId,
          action.payload ?? normalizeApiError(action.error),
        );
      });
  },
});

export const commentsReducer = commentsSlice.reducer;
