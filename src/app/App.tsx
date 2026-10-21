import { Button } from "antd";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { restoreSession } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { router } from "./router";

const App = () => {
  const dispatch = useAppDispatch();
  const { error, initialized, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized && status === "idle") {
      void dispatch(restoreSession());
    }
  }, [dispatch, initialized, status]);

  if (!initialized) {
    if (status === "failed") {
      return (
        <main role="alert">
          <p>{error?.message ?? "Unable to restore your session."}</p>
          <Button onClick={() => void dispatch(restoreSession())}>Retry</Button>
        </main>
      );
    }
    return <main aria-busy="true">Restoring session…</main>;
  }

  return <RouterProvider router={router} />;
};

export default App;
