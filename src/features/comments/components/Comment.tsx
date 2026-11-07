import { CloseOutlined } from "@ant-design/icons";
import { Input, Modal, Spin } from "antd";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import UserAvatar from "../../../components/ui/UserAvatar";
import { parseTags, shortTime } from "../../stories/format";
import { getStoryImageUrl } from "../../stories/images";
import type { Comment as CommentModel } from "../comment.types";
import { addComment, addReply } from "../commentsSlice";
import styles from "./Comment.module.css";
import type { CommentsModalProps, ReplyTarget } from "./Comment.types";
import ReplyList from "./ReplyList";

const MAX_LENGTH = 100;

interface CommentItemProps {
  comment: CommentModel;
  comments: readonly CommentModel[];
  onReply: (target: ReplyTarget) => void;
}

const CommentItem = ({ comment, comments, onReply }: CommentItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const username = comment.user_id?.username ?? "Unknown";
  const isLong = comment.content.length > 90;

  return (
    <li className={styles.item}>
      <UserAvatar username={username} size={32} />
      <div className={styles.itemBody}>
        <p
          className={`${styles.text} ${
            isLong && !expanded ? styles.textClamped : ""
          }`}
        >
          <span className={styles.user}>{username}</span>
          {comment.content}
        </p>
        <div className={styles.meta}>
          <time dateTime={comment.createdAt}>{shortTime(comment.createdAt)}</time>
          <button
            type="button"
            className={styles.metaButton}
            onClick={() => onReply({ commentId: comment._id, username })}
          >
            Reply
          </button>
          {isLong ? (
            <button
              type="button"
              className={styles.metaButton}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          ) : null}
        </div>
        <ReplyList comments={comments} rootComment={comment} setReplyTarget={onReply} />
      </div>
    </li>
  );
};

const CommentsModal = ({ open, onClose, story }: CommentsModalProps) => {
  const { _id: storyId, username: storyOwner, caption, image, imageFileId, tags, postDate } =
    story;
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.comments.byStoryId[storyId] ?? []);
  const status = useAppSelector(
    (state) => state.comments.statusByStoryId[storyId] ?? "idle",
  );
  const error = useAppSelector(
    (state) => state.comments.errorByStoryId[storyId] ?? null,
  );
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const topLevelComments = comments.filter((comment) => comment.parentId === null);
  const tagList = parseTags(tags);

  useEffect(() => {
    if (!open) {
      setReplyTarget(null);
      setContent("");
    }
  }, [open]);

  const startReply = (target: ReplyTarget): void => {
    setReplyTarget(target);
    inputRef.current?.focus();
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const text = content.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    try {
      if (replyTarget) {
        await dispatch(
          addReply({ storyId, parentCommentId: replyTarget.commentId, content: text }),
        ).unwrap();
        setReplyTarget(null);
      } else {
        await dispatch(addComment({ storyId, content: text })).unwrap();
      }
      setContent("");
    } catch {
      // The comments slice exposes the normalized request error below.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width="min(1100px, calc(100vw - 32px))"
      className={styles.modal}
      closeIcon={<CloseOutlined aria-label="Close comments" />}
      destroyOnClose
    >
      <div className={styles.layout}>
        <div className={styles.media}>
          <img src={getStoryImageUrl(image, imageFileId)} alt={caption} />
        </div>

        <section className={styles.panel} aria-label="Comments">
          <header className={styles.panelHeader}>
            <UserAvatar username={storyOwner} size={32} ring />
            {storyOwner}
          </header>

          <div className={styles.list}>
            <ul style={{ listStyle: "none" }}>
              <li className={`${styles.item} ${styles.captionItem}`}>
                <UserAvatar username={storyOwner} size={32} />
                <div className={styles.itemBody}>
                  <p className={styles.text}>
                    <span className={styles.user}>{storyOwner}</span>
                    {caption}
                    {tagList.length ? " " : null}
                    {tagList.map((tag, index) => (
                      <span key={`${tag}-${index}`} className={styles.tag}>
                        #{tag}{" "}
                      </span>
                    ))}
                  </p>
                  <div className={styles.meta}>
                    <time dateTime={postDate}>{shortTime(postDate)}</time>
                  </div>
                </div>
              </li>

              {topLevelComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  comments={comments}
                  onReply={startReply}
                />
              ))}
            </ul>

            {status === "loading" && comments.length === 0 ? (
              <div className={styles.loading}>
                <Spin />
              </div>
            ) : null}

            {status !== "loading" && topLevelComments.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>No comments yet.</p>
                <p className={styles.emptyText}>Start the conversation.</p>
              </div>
            ) : null}
          </div>

          <div className={styles.footer}>
            {replyTarget ? (
              <div className={styles.replyBanner}>
                <span>Replying to @{replyTarget.username}</span>
                <button
                  type="button"
                  aria-label="Cancel reply"
                  onClick={() => setReplyTarget(null)}
                >
                  <CloseOutlined />
                </button>
              </div>
            ) : null}
            {error ? (
              <p className={styles.error} role="alert">
                {error.message}
              </p>
            ) : null}
            <form className={styles.form} onSubmit={(event) => void onSubmit(event)}>
              <Input.TextArea
                ref={(instance) => {
                  inputRef.current = instance?.resizableTextArea?.textArea ?? null;
                }}
                className={styles.input}
                variant="borderless"
                aria-label="Add a comment"
                placeholder={
                  replyTarget
                    ? `Reply to @${replyTarget.username}…`
                    : "Add a comment…"
                }
                autoSize={{ minRows: 1, maxRows: 4 }}
                maxLength={MAX_LENGTH}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void onSubmit(event);
                  }
                }}
              />
              <button
                type="submit"
                className={styles.post}
                disabled={!content.trim() || submitting}
              >
                {submitting ? "Posting…" : "Post"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default CommentsModal;
