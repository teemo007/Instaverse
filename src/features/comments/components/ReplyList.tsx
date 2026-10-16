import { DownOutlined } from "@ant-design/icons";
import { Avatar, Button, List, Typography } from "antd";
import moment from "moment";
import { useMemo, useState } from "react";

import { buildReplyThread } from "../threading";
import styles from "./ReplyList.styles";
import type { ReplyListProps } from "./ReplyList.types";

const { Paragraph, Text } = Typography;

const ReplyList = ({
  comments,
  rootComment,
  setReplyTarget,
}: ReplyListProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const replies = useMemo(
    () => buildReplyThread(comments, rootComment._id),
    [comments, rootComment._id],
  );
  const replyCount = replies.length;
  const replyLabel = showReplies
    ? "Hide replies"
    : `View ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`;

  return (
    <div style={styles.thread}>
      {replyCount > 0 ? (
        <Button
          type="text"
          size="small"
          icon={
            <DownOutlined
              style={{
                ...styles.toggleIcon,
                transform: showReplies ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          }
          onClick={() => setShowReplies((visible) => !visible)}
          style={styles.toggleButton}
        >
          {replyLabel}
        </Button>
      ) : null}

      {showReplies ? (
        <List
          dataSource={replies}
          split={false}
          style={styles.replyList}
          renderItem={(reply) => {
            const username = reply.user_id?.username ?? "Unknown";

            return (
              <List.Item key={reply._id} style={styles.replyItem}>
                <div style={styles.replyRow}>
                  <Avatar size={32} style={styles.avatar}>
                    {username.charAt(0).toUpperCase()}
                  </Avatar>

                  <div style={styles.replyBody}>
                    <div style={styles.usernameRow}>
                      <Text type="secondary" style={styles.username}>
                        {username}
                      </Text>
                      <Text type="secondary" style={styles.replyTarget}>
                        › {reply.parentUsername}
                      </Text>
                    </div>
                    <Paragraph style={styles.replyText}>
                      {reply.content}
                    </Paragraph>

                    <div style={styles.metaRow}>
                      <Text type="secondary" style={styles.timestamp}>
                        {moment(reply.createdAt).fromNow()}
                      </Text>
                      <Button
                        type="text"
                        size="small"
                        style={styles.actionButton}
                        onClick={() =>
                          setReplyTarget({ commentId: reply._id, username })
                        }
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      ) : null}
    </div>
  );
};

export default ReplyList;
