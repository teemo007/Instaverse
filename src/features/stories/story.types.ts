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

export interface StoryInput extends StoryFormValues {
  username: string;
}
