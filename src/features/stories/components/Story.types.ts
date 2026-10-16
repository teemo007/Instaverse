import type { Dispatch, SetStateAction } from "react";

import type { Story } from "../story.types";

export type OpenedComments = Record<string, boolean>;

export interface StoryProps extends Story {
  openedComments: OpenedComments;
  setOpenedComments: Dispatch<SetStateAction<OpenedComments>>;
  setEditId: Dispatch<SetStateAction<string | null>>;
}
