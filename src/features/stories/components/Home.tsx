import { Button } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import UserAvatar from "../../../components/ui/UserAvatar";
import { useSignOut } from "../../auth/useSignOut";
import { useComposer } from "../composer/composerContext";
import { fetchStories } from "../storiesSlice";
import styles from "./Home.module.css";
import StoryList from "./StoryList";

const Home = () => {
  const dispatch = useAppDispatch();
  const { openCreate } = useComposer();
  const { status, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    void dispatch(fetchStories());
  }, [dispatch]);

  const handleSignOut = useSignOut();

  return (
    <div className={styles.page}>
      <section className={styles.feed} aria-label="Feed">
        <StoryList />
      </section>

      <aside className={styles.aside}>
        <div className={styles.asideSticky}>
          {user ? (
            <>
              <div className={styles.account}>
                <UserAvatar username={user.username} size={44} ring />
                <div className={styles.accountText}>
                  <div className={styles.accountName}>{user.username}</div>
                  <div className={styles.accountMeta}>{user.email}</div>
                </div>
                <button
                  type="button"
                  className={styles.textAction}
                  disabled={status === "loading"}
                  onClick={() => void handleSignOut()}
                >
                  Log out
                </button>
              </div>
              <button
                type="button"
                className={styles.composePrompt}
                onClick={openCreate}
              >
                <UserAvatar username={user.username} size={32} />
                What&apos;s your moment today, {user.username}?
              </button>
            </>
          ) : (
            <div className={styles.welcome}>
              <h2 className={styles.welcomeTitle}>Welcome to Kapsule</h2>
              <p className={styles.welcomeText}>
                Log in to seal your everyday moments, like posts and join the
                conversation.
              </p>
              <div className={styles.welcomeActions}>
                <Link to="/authForm" state={{ mode: "signIn" }}>
                  <Button type="primary" block>
                    Log in
                  </Button>
                </Link>
                <Link to="/authForm" state={{ mode: "signUp" }}>
                  <Button block>Create new account</Button>
                </Link>
              </div>
            </div>
          )}
          <p className={styles.footer}>© {new Date().getFullYear()} Kapsule</p>
        </div>
      </aside>
    </div>
  );
};

export default Home;
