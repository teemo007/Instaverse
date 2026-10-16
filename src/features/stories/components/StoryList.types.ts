import type { Dispatch, SetStateAction } from "react";

export interface StoryListProps {
  setEditId: Dispatch<SetStateAction<string | null>>;
}
