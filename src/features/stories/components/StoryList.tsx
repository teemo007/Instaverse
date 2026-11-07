import { CameraOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useComposer } from "../composer/composerContext";
import { fetchStories } from "../storiesSlice";
import Story from "./Story";
import styles from "./StoryList.module.css";

const SkeletonPost = () => (
  <div className={styles.skeleton} aria-hidden="true">
    <div className={styles.skeletonHeader}>
      <div className={styles.skeletonCircle} />
      <div className={styles.skeletonLine} style={{ width: 120 }} />
    </div>
    <div className={styles.skeletonMedia} />
    <div className={styles.skeletonLine} style={{ width: "40%", marginTop: 16 }} />
    <div className={styles.skeletonLine} style={{ width: "70%", marginTop: 8 }} />
  </div>
);

const StoryList = () => {
  const dispatch = useAppDispatch();
  const { openCreate } = useComposer();
  const user = useAppSelector((state) => state.auth.user);
  const { items: stories, status, error } = useAppSelector((state) => state.stories);

  if (!stories.length) {
    if (status === "idle" || status === "loading") {
      return (
        <div aria-busy="true" aria-label="Loading posts">
          <SkeletonPost />
          <SkeletonPost />
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className={styles.empty} role="alert">
          <h2 className={styles.emptyTitle}>Couldn&apos;t load posts</h2>
          <p className={styles.emptyText}>
            {error?.message ?? "Something went wrong. Please try again."}
          </p>
          <Button type="primary" onClick={() => void dispatch(fetchStories())}>
            Try again
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>
          <CameraOutlined />
        </span>
        <h2 className={styles.emptyTitle}>No posts yet</h2>
        <p className={styles.emptyText}>
          When people share photos, they&apos;ll appear here.
        </p>
        {user ? (
          <Button type="link" onClick={openCreate}>
            Share your first photo
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {stories.map((story) => (
        <Story key={story._id} {...story} />
      ))}
    </div>
  );
};

export default StoryList;
