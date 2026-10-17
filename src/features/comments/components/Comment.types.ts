import type { Dispatch, SetStateAction } from "react";

import type { CommentFormValues } from "../comment.types";

export type OpenedComments = Record<string, boolean>;

export interface ReplyTarget {
  commentId: string;
  username: string;
}

export interface CommentProps {
  storyOwner: string;
  storyId: string;
  setOpenedComments: Dispatch<SetStateAction<OpenedComments>>;
}

export type CommentFormFields = CommentFormValues;
