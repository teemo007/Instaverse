export interface Story {
  _id: string;
  caption: string;
  username: string;
  userId: string;
  image: string;
  imageFileId?: string;
  imageWidth?: number;
  imageHeight?: number;
  tags?: string;
  likes: string[];
  postDate: string;
  comments: string[];
}

export interface StoryFormValues {
  caption: string;
  tags?: string;
  image: string;
  imageFileId?: string;
}

// The API takes the author from the session. On edit, the image fields are
// omitted when unchanged so legacy Base64 images are never re-sent.
export interface StoryInput {
  caption: string;
  tags?: string;
  image?: string;
  imageFileId?: string;
}
