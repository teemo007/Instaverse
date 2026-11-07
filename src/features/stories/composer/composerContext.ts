import { createContext, useContext } from "react";

export interface ComposerContextValue {
  openCreate: () => void;
  openEdit: (storyId: string) => void;
}

export const ComposerContext = createContext<ComposerContextValue | null>(null);

export const useComposer = (): ComposerContextValue => {
  const value = useContext(ComposerContext);
  if (!value) {
    throw new Error("useComposer must be used inside ComposerProvider.");
  }
  return value;
};
