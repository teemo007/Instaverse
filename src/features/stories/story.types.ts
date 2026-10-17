export interface Story {
  _id: string;
  caption: string;
  username: string;
  userId: string;
  image: string;
  tags?: string;
  likes: string[];
  postDate: string;
  comments: string[];
}

export interface StoryFormValues {
  caption: string;
  tags?: string;
  image: string;
}

export interface StoryInput extends StoryFormValues {
  username: string;
}
