import { useMemo, useState } from "react";

import UserAvatar from "../../../components/ui/UserAvatar";
import { shortTime } from "../../stories/format";
import { buildReplyThread } from "../threading";
import styles from "./ReplyList.module.css";
import type { ReplyListProps } from "./ReplyList.types";

const ReplyList = ({ comments, rootComment, setReplyTarget }: ReplyListProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const replies = useMemo(
    () => buildReplyThread(comments, rootComment._id),
    [comments, rootComment._id],
  );

  if (replies.length === 0) return null;

  return (
    <div className={styles.thread}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={showReplies}
        onClick={() => setShowReplies((visible) => !visible)}
      >
        {showReplies ? "Hide replies" : `View replies (${replies.length})`}
      </button>

      {showReplies ? (
        <ul className={styles.list}>
          {replies.map((reply) => {
            const username = reply.user_id?.username ?? "Unknown";
            return (
              <li key={reply._id} className={styles.item}>
                <UserAvatar username={username} size={24} />
                <div className={styles.body}>
                  <p className={styles.text}>
                    <span className={styles.user}>{username}</span>
                    <span className={styles.mention}>@{reply.parentUsername}</span>
                    {reply.content}
                  </p>
                  <div className={styles.meta}>
                    <time dateTime={reply.createdAt}>{shortTime(reply.createdAt)}</time>
                    <button
                      type="button"
                      className={styles.metaButton}
                      onClick={() => setReplyTarget({ commentId: reply._id, username })}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default ReplyList;
