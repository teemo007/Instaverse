import { Button } from "antd";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import KapsuleMark from "../components/ui/KapsuleMark";
import { restoreSession } from "../features/auth/authSlice";
import styles from "./App.module.css";
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
        <main className={styles.splash} role="alert">
          <KapsuleMark size={72} />
          <p className={styles.message}>
            {error?.message ?? "Unable to restore your session."}
          </p>
          <Button type="primary" onClick={() => void dispatch(restoreSession())}>
            Retry
          </Button>
        </main>
      );
    }
    return (
      <main className={styles.splash} aria-busy="true">
        <KapsuleMark className={styles.logo} size={72} />
        <span className="visually-hidden">Restoring session…</span>
      </main>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
