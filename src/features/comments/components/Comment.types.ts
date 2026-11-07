import type { Story } from "../../stories/story.types";
import type { CommentFormValues } from "../comment.types";

export interface ReplyTarget {
  commentId: string;
  username: string;
}

export interface CommentsModalProps {
  open: boolean;
  onClose: () => void;
  story: Story;
}

export type CommentFormFields = CommentFormValues;
