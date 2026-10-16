import { describe, expect, it } from "vitest";

import {
  addComment,
  addReply,
  commentsReducer,
  fetchComments,
  type CommentsState,
} from "./commentsSlice";
import type { Comment } from "./comment.types";

const createComment = (
  id: string,
  storyId: string,
  username: string,
  parentId: string | null,
): Comment => ({
  _id: id,
  story_id: storyId,
  user_id: { _id: `user-${username}`, username },
  content: `Comment ${id}`,
  createdAt: "2026-10-15T12:00:00.000Z",
  parentId,
  replies: [],
});

const rootComment = createComment("root-1", "story-1", "alice", null);
const otherStoryComment = createComment(
  "root-2",
  "story-2",
  "sora",
  null,
);

const populatedState = (): CommentsState => ({
  byStoryId: {
    "story-1": [rootComment],
    "story-2": [otherStoryComment],
  },
  statusByStoryId: {
    "story-1": "succeeded",
    "story-2": "succeeded",
  },
  errorByStoryId: {
    "story-1": null,
    "story-2": { message: "Keep this error", status: 409 },
  },
});

describe("commentsSlice", () => {
  it("replaces only the requested story bucket after fetch", () => {
    const replacement = createComment(
      "replacement-1",
      "story-1",
      "bob",
      null,
    );
    const nextState = commentsReducer(
      populatedState(),
      fetchComments.fulfilled([replacement], "request-1", "story-1"),
    );

    expect(nextState.byStoryId["story-1"]).toEqual([replacement]);
    expect(nextState.byStoryId["story-2"]).toEqual([otherStoryComment]);
  });

  it("appends a root comment to its story", () => {
    const addedComment = createComment(
      "comment-2",
      "story-1",
      "bob",
      null,
    );
    const nextState = commentsReducer(
      populatedState(),
      addComment.fulfilled(addedComment, "request-1", {
        storyId: "story-1",
        content: addedComment.content,
      }),
    );

    expect(nextState.byStoryId["story-1"]).toEqual([
      rootComment,
      addedComment,
    ]);
  });

  it("stores a reply with the submitted parent id instead of backend username", () => {
    const backendReply = createComment(
      "reply-1",
      "story-1",
      "bob",
      "alice",
    );
    const nextState = commentsReducer(
      populatedState(),
      addReply.fulfilled(backendReply, "request-1", {
        storyId: "story-1",
        parentCommentId: rootComment._id,
        content: backendReply.content,
      }),
    );

    expect(nextState.byStoryId["story-1"]).toEqual([
      rootComment,
      { ...backendReply, parentId: rootComment._id },
    ]);
  });

  it("sets pending state only for the requested story", () => {
    const nextState = commentsReducer(
      populatedState(),
      fetchComments.pending("request-1", "story-1"),
    );

    expect(nextState.statusByStoryId).toEqual({
      "story-1": "loading",
      "story-2": "succeeded",
    });
    expect(nextState.errorByStoryId).toEqual({
      "story-1": null,
      "story-2": { message: "Keep this error", status: 409 },
    });
  });

  it("stores a rejection only for the requested story", () => {
    const error = { message: "Unable to load comments", status: 503 };
    const nextState = commentsReducer(
      populatedState(),
      fetchComments.rejected(
        new Error("Rejected"),
        "request-1",
        "story-1",
        error,
      ),
    );

    expect(nextState.statusByStoryId).toEqual({
      "story-1": "failed",
      "story-2": "succeeded",
    });
    expect(nextState.errorByStoryId).toEqual({
      "story-1": error,
      "story-2": { message: "Keep this error", status: 409 },
    });
  });
});
