import type { Dispatch, SetStateAction } from "react";

import type { Comment } from "../comment.types";
import type { ReplyTarget } from "./Comment.types";

export interface ReplyListProps {
  comments: readonly Comment[];
  rootComment: Comment;
  setReplyTarget: Dispatch<SetStateAction<ReplyTarget | null>>;
}
