import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { AppError, AsyncStatus } from "../../api/api.types";
import { normalizeApiError } from "../../api/errors";
import {
  createStoryRequest,
  deleteStoryRequest,
  fetchStoriesRequest,
  likeStoryRequest,
  updateStoryRequest,
} from "./storiesApi";
import type { Story, StoryInput } from "./story.types";

export interface StoriesState {
  items: Story[];
  status: AsyncStatus;
  error: AppError | null;
}

interface UpdateStoryArgs {
  storyId: string;
  story: StoryInput;
}

const initialState: StoriesState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchStories = createAsyncThunk<
  Story[],
  void,
  { rejectValue: AppError }
>("stories/fetchStories", async (_, { rejectWithValue }) => {
  try {
    return await fetchStoriesRequest();
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const createStory = createAsyncThunk<
  Story,
  StoryInput,
  { rejectValue: AppError }
>("stories/createStory", async (story, { rejectWithValue }) => {
  try {
    return await createStoryRequest(story);
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const updateStory = createAsyncThunk<
  Story,
  UpdateStoryArgs,
  { rejectValue: AppError }
>("stories/updateStory", async ({ storyId, story }, { rejectWithValue }) => {
  try {
    return await updateStoryRequest(storyId, story);
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const deleteStory = createAsyncThunk<
  string,
  string,
  { rejectValue: AppError }
>("stories/deleteStory", async (storyId, { rejectWithValue }) => {
  try {
    await deleteStoryRequest(storyId);
    return storyId;
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const likeStory = createAsyncThunk<
  Story,
  string,
  { rejectValue: AppError }
>("stories/likeStory", async (storyId, { rejectWithValue }) => {
  try {
    return await likeStoryRequest(storyId);
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      })
      .addCase(createStory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      })
      .addCase(updateStory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateStory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (story) => story._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      })
      .addCase(deleteStory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (story) => story._id !== action.payload,
        );
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      })
      .addCase(likeStory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(likeStory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (story) => story._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(likeStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      });
  },
});

export const storiesReducer = storiesSlice.reducer;
