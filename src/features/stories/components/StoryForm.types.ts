import type { Dispatch, SetStateAction } from "react";

export interface StoryFormProps {
  editId: string | null;
  setEditId: Dispatch<SetStateAction<string | null>>;
}
