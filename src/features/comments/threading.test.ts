import { describe, expect, it } from "vitest";

import { buildReplyThread } from "./threading";
import type { Comment } from "./comment.types";

const createComment = (
  id: string,
  username: string,
  parentId: string | null,
): Comment => ({
  _id: id,
  story_id: "story-1",
  user_id: { _id: `user-${username}`, username },
  content: `Comment ${id}`,
  createdAt: "2026-10-15T12:00:00.000Z",
  parentId,
  replies: [],
});

describe("buildReplyThread", () => {
  it("flattens every descendant in source order with its immediate parent", () => {
    const comments = [
      createComment("root-a", "alice", null),
      createComment("reply-a1", "bob", "root-a"),
      createComment("reply-a2", "carol", "reply-a1"),
      createComment("reply-a3", "dave", "reply-a2"),
      createComment("root-b", "erin", null),
      createComment("reply-b1", "frank", "root-b"),
    ];

    const thread = buildReplyThread(comments, "root-a");

    expect(
      thread.map(({ _id, parentUsername }) => ({ _id, parentUsername })),
    ).toEqual([
      { _id: "reply-a1", parentUsername: "alice" },
      { _id: "reply-a2", parentUsername: "bob" },
      { _id: "reply-a3", parentUsername: "carol" },
    ]);
  });

  it("excludes descendants that belong to another root", () => {
    const comments = [
      createComment("root-a", "alice", null),
      createComment("root-b", "bob", null),
      createComment("reply-b1", "carol", "root-b"),
    ];

    expect(buildReplyThread(comments, "root-a")).toEqual([]);
  });

  it("excludes a chain whose parent is missing", () => {
    const comments = [
      createComment("root-a", "alice", null),
      createComment("orphan", "bob", "missing-parent"),
      createComment("orphan-child", "carol", "orphan"),
    ];

    expect(buildReplyThread(comments, "root-a")).toEqual([]);
  });

  it("terminates and excludes cyclic parent chains", () => {
    const comments = [
      createComment("root-a", "alice", null),
      createComment("cycle-a", "bob", "cycle-b"),
      createComment("cycle-b", "carol", "cycle-a"),
    ];

    expect(buildReplyThread(comments, "root-a")).toEqual([]);
  });
});
