import { Outlet, useLocation } from "react-router-dom";

import ComposerProvider from "../../features/stories/composer/ComposerProvider";
import AppBar from "./AppBar";
import styles from "./RootLayout.module.css";

const RootLayout = () => {
  const { pathname } = useLocation();

  if (pathname === "/authForm") {
    return (
      <main className={styles.bare}>
        <Outlet />
      </main>
    );
  }

  return (
    <ComposerProvider>
      <AppBar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </ComposerProvider>
  );
};

export default RootLayout;
