import { useCallback, useMemo, useState, type ReactNode } from "react";

import StoryForm from "../components/StoryForm";
import { ComposerContext } from "./composerContext";

type ComposerState = { open: false } | { open: true; editId: string | null };

const ComposerProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ComposerState>({ open: false });

  const openCreate = useCallback(() => setState({ open: true, editId: null }), []);
  const openEdit = useCallback(
    (storyId: string) => setState({ open: true, editId: storyId }),
    [],
  );
  const close = useCallback(() => setState({ open: false }), []);

  const value = useMemo(() => ({ openCreate, openEdit }), [openCreate, openEdit]);

  return (
    <ComposerContext.Provider value={value}>
      {children}
      <StoryForm
        open={state.open}
        editId={state.open ? state.editId : null}
        onClose={close}
      />
    </ComposerContext.Provider>
  );
};

export default ComposerProvider;
