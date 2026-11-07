import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Dropdown, Modal, message } from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import UserAvatar from "../../../components/ui/UserAvatar";
import { fetchComments } from "../../comments/commentsSlice";
import CommentsModal from "../../comments/components/Comment";
import { useComposer } from "../composer/composerContext";
import { parseTags, shortTime } from "../format";
import { getStoryImageUrl } from "../images";
import { deleteStory, likeStory } from "../storiesSlice";
import type { Story as StoryModel } from "../story.types";
import styles from "./Story.module.css";

const LONG_CAPTION = 125;

const clampRatio = (width?: number, height?: number): number | null =>
  width && height ? Math.min(Math.max(width / height, 0.8), 1.91) : null;

const Story = (story: StoryModel) => {
  const {
    caption,
    image,
    imageFileId,
    imageWidth,
    imageHeight,
    likes,
    username,
    userId,
    tags,
    postDate,
    _id,
  } = story;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { openEdit } = useComposer();
  const [modal, modalContext] = Modal.useModal();
  const user = useAppSelector((state) => state.auth.user);
  const commentCount = useAppSelector(
    (state) =>
      (state.comments.byStoryId[_id] ?? []).filter(
        (comment) => comment.parentId === null,
      ).length,
  );
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const [ratio, setRatio] = useState<number | null>(
    clampRatio(imageWidth, imageHeight),
  );
  const liking = useRef(false);

  const isLiked = user ? likes.includes(user._id) : false;
  const isOwner = user?._id === userId;
  const tagList = parseTags(tags);
  const isLongCaption =
    caption.length > LONG_CAPTION || caption.split("\n").length > 2;

  useEffect(() => {
    if (!user) {
      setCommentsOpen(false);
      return;
    }
    void dispatch(fetchComments(_id));
  }, [dispatch, _id, user]);

  const toggleLike = async (): Promise<void> => {
    if (!user) {
      navigate("/authForm", { state: { mode: "signIn" } });
      return;
    }
    if (liking.current) return;
    liking.current = true;
    if (!isLiked) setPopKey((key) => key + 1);
    try {
      await dispatch(likeStory(_id)).unwrap();
    } catch {
      void message.error("Couldn't update like. Please try again.");
    } finally {
      liking.current = false;
    }
  };

  const handleDoubleClick = (): void => {
    if (!user) {
      navigate("/authForm", { state: { mode: "signIn" } });
      return;
    }
    setBurstKey((key) => key + 1);
    if (!isLiked) void toggleLike();
  };

  const openComments = (): void => {
    if (!user) {
      navigate("/authForm", { state: { mode: "signIn" } });
      return;
    }
    void dispatch(fetchComments(_id));
    setCommentsOpen(true);
  };

  const confirmDelete = (): void => {
    void modal.confirm({
      title: "Delete post?",
      content: "Are you sure you want to delete this post? This can't be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await dispatch(deleteStory(_id)).unwrap();
          void message.success("Post deleted.");
        } catch {
          void message.error("Unable to delete post.");
        }
      },
    });
  };

  return (
    <article className={styles.post} aria-label={`Post by ${username}`}>
      {modalContext}
      <header className={styles.header}>
        <UserAvatar username={username} size={32} ring />
        <div className={styles.author}>
          <span className={styles.username}>{username}</span>
          <span className={styles.dot}>•</span>
          <time
            className={styles.time}
            dateTime={postDate}
            title={moment(postDate).format("LLL")}
          >
            {shortTime(postDate)}
          </time>
        </div>
        {isOwner ? (
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
                {
                  key: "edit",
                  label: "Edit",
                  icon: <EditOutlined />,
                  onClick: () => openEdit(_id),
                },
                {
                  key: "delete",
                  label: "Delete",
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: confirmDelete,
                },
              ],
            }}
          >
            <button type="button" className={styles.more} aria-label="More options">
              <EllipsisOutlined />
            </button>
          </Dropdown>
        ) : null}
      </header>

      <div
        className={styles.media}
        style={ratio ? { aspectRatio: String(ratio) } : undefined}
        onDoubleClick={handleDoubleClick}
      >
        <img
          className={`${styles.image} ${ratio ? styles.imageFill : ""}`}
          src={getStoryImageUrl(image, imageFileId)}
          alt={caption}
          loading="lazy"
          draggable={false}
          onLoad={(event) => {
            if (ratio) return;
            const { naturalWidth, naturalHeight } = event.currentTarget;
            setRatio(clampRatio(naturalWidth, naturalHeight));
          }}
        />
        {burstKey > 0 ? (
          <HeartFilled key={burstKey} className={styles.burst} aria-hidden="true" />
        ) : null}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${isLiked ? styles.liked : ""}`}
          aria-label={isLiked ? "Unlike" : "Like"}
          aria-pressed={isLiked}
          onClick={() => void toggleLike()}
        >
          <span key={popKey} className={popKey ? styles.pop : undefined}>
            {isLiked ? <HeartFilled /> : <HeartOutlined />}
          </span>
        </button>
        <button
          type="button"
          className={styles.action}
          aria-label="Comment"
          onClick={openComments}
        >
          <MessageOutlined style={{ transform: "scaleX(-1)" }} />
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.likes}>
          {likes.length.toLocaleString()} {likes.length === 1 ? "like" : "likes"}
        </div>

        <div>
          <p
            className={`${styles.caption} ${
              isLongCaption && !captionExpanded ? styles.captionClamped : ""
            }`}
          >
            <span className={styles.captionUser}>{username}</span>
            {caption}
          </p>
          {isLongCaption && !captionExpanded ? (
            <button
              type="button"
              className={styles.textButton}
              onClick={() => setCaptionExpanded(true)}
            >
              more
            </button>
          ) : null}
        </div>

        {tagList.length ? (
          <div className={styles.tags}>
            {tagList.map((tag, index) => (
              <span key={`${tag}-${index}`} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {user ? (
          <button type="button" className={styles.textButton} onClick={openComments}>
            {commentCount > 0
              ? `View ${commentCount === 1 ? "1 comment" : `all ${commentCount} comments`}`
              : "Add a comment…"}
          </button>
        ) : null}
      </div>

      {user ? (
        <CommentsModal
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          story={story}
        />
      ) : null}
    </article>
  );
};

export default Story;
