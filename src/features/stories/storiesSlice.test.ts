import { describe, expect, it } from "vitest";

import {
  createStory,
  deleteStory,
  fetchStories,
  likeStory,
  storiesReducer,
  updateStory,
  type StoriesState,
} from "./storiesSlice";
import type { Story, StoryInput } from "./story.types";

const firstStory: Story = {
  _id: "story-1",
  caption: "First story",
  username: "kyle",
  userId: "user-1",
  image: "data:image/png;base64,first",
  tags: "first",
  likes: [],
  postDate: "2026-10-15T12:00:00.000Z",
  comments: [],
};

const secondStory: Story = {
  _id: "story-2",
  caption: "Second story",
  username: "sora",
  userId: "user-2",
  image: "data:image/png;base64,second",
  likes: ["user-1"],
  postDate: "2026-10-15T13:00:00.000Z",
  comments: ["comment-1"],
};

const storyInput: StoryInput = {
  caption: firstStory.caption,
  username: firstStory.username,
  image: firstStory.image,
  tags: firstStory.tags,
};

const stateWithStories = (...items: Story[]): StoriesState => ({
  items,
  status: "idle",
  error: null,
});

describe("storiesSlice", () => {
  it("sets loading and clears a stale error when fetch starts", () => {
    const state: StoriesState = {
      items: [firstStory],
      status: "failed",
      error: { message: "Old failure", status: 500 },
    };

    expect(storiesReducer(state, fetchStories.pending("request-1"))).toEqual({
      items: [firstStory],
      status: "loading",
      error: null,
    });
  });

  it("replaces the collection when fetch succeeds", () => {
    expect(
      storiesReducer(
        stateWithStories(firstStory),
        fetchStories.fulfilled([secondStory], "request-1"),
      ),
    ).toEqual({
      items: [secondStory],
      status: "succeeded",
      error: null,
    });
  });

  it("appends a newly created story", () => {
    const nextState = storiesReducer(
      stateWithStories(firstStory),
      createStory.fulfilled(secondStory, "request-1", storyInput),
    );

    expect(nextState.items).toEqual([firstStory, secondStory]);
  });

  it("replaces an updated story by id", () => {
    const updatedStory = { ...firstStory, caption: "Updated caption" };
    const nextState = storiesReducer(
      stateWithStories(firstStory, secondStory),
      updateStory.fulfilled(updatedStory, "request-1", {
        storyId: firstStory._id,
        story: storyInput,
      }),
    );

    expect(nextState.items).toEqual([updatedStory, secondStory]);
  });

  it("replaces a liked story by id", () => {
    const likedStory = { ...firstStory, likes: ["user-1"] };
    const nextState = storiesReducer(
      stateWithStories(firstStory, secondStory),
      likeStory.fulfilled(likedStory, "request-1", firstStory._id),
    );

    expect(nextState.items).toEqual([likedStory, secondStory]);
  });

  it("removes a deleted story by id", () => {
    const nextState = storiesReducer(
      stateWithStories(firstStory, secondStory),
      deleteStory.fulfilled(firstStory._id, "request-1", firstStory._id),
    );

    expect(nextState.items).toEqual([secondStory]);
  });

  it("stores the normalized error when fetch fails", () => {
    const error = { message: "Unable to load stories", status: 503 };
    const nextState = storiesReducer(
      undefined,
      fetchStories.rejected(
        new Error("Rejected"),
        "request-1",
        undefined,
        error,
      ),
    );

    expect(nextState.status).toBe("failed");
    expect(nextState.error).toEqual(error);
  });
});
