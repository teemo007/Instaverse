import type { Comment, ThreadedReply } from "./comment.types";

export const buildReplyThread = (
  comments: readonly Comment[],
  rootCommentId: string,
): ThreadedReply[] => {
  const commentsById = new Map(
    comments.map((comment) => [comment._id, comment]),
  );

  return comments.flatMap((comment) => {
    const visitedIds = new Set([comment._id]);
    let parentId = comment.parentId;

    while (parentId) {
      if (parentId === rootCommentId) {
        const immediateParent = commentsById.get(comment.parentId ?? "");
        return [
          {
            ...comment,
            parentUsername: immediateParent?.user_id?.username ?? "Unknown",
          },
        ];
      }

      if (visitedIds.has(parentId)) {
        return [];
      }

      visitedIds.add(parentId);
      const parent = commentsById.get(parentId);
      if (!parent) {
        return [];
      }

      parentId = parent.parentId;
    }

    return [];
  });
};
