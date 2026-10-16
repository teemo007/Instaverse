export interface CommentAuthor {
  _id?: string;
  username: string;
}

export interface Comment {
  _id: string;
  story_id: string;
  user_id: CommentAuthor | null;
  content: string;
  createdAt: string;
  parentId: string | null;
  replies: string[];
}

export interface CommentFormValues {
  content: string;
}

export interface ThreadedReply extends Comment {
  parentUsername: string;
}
