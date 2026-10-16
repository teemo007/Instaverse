import { CloseOutlined } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Empty,
  Form,
  Input,
  List,
  Space,
  Typography,
} from "antd";
import moment from "moment";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addComment, addReply } from "../commentsSlice";
import styles from "./Comment.styles";
import type {
  CommentFormFields,
  CommentProps,
  ReplyTarget,
} from "./Comment.types";
import ReplyList from "./ReplyList";

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

const Comment = ({
  storyOwner,
  setOpenedComments,
  storyId,
}: CommentProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const dispatch = useAppDispatch();
  const comments = useAppSelector(
    (state) => state.comments.byStoryId[storyId] ?? [],
  );
  const status = useAppSelector(
    (state) => state.comments.statusByStoryId[storyId] ?? "idle",
  );
  const error = useAppSelector(
    (state) => state.comments.errorByStoryId[storyId] ?? null,
  );
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null,
  );
  const [form] = Form.useForm<CommentFormFields>();

  const closeComments = (): void => {
    setOpenedComments((current) => {
      const next = { ...current };
      delete next[storyId];
      return next;
    });
  };

  const onSubmit = async (formValues: CommentFormFields): Promise<void> => {
    try {
      if (replyTarget) {
        await dispatch(
          addReply({
            storyId,
            parentCommentId: replyTarget.commentId,
            content: formValues.content,
          }),
        ).unwrap();
        setReplyTarget(null);
      } else {
        await dispatch(addComment({ storyId, content: formValues.content })).unwrap();
      }

      form.resetFields();
    } catch {
      // The comments slice exposes the normalized request error below.
    }
  };

  return (
    <div style={styles.commentOverlay} onClick={closeComments}>
      <div
        style={styles.commentContent}
        onClick={(event) => event.stopPropagation()}
      >
        <CloseOutlined style={styles.exitComment} onClick={closeComments} />
        <div
          style={styles.headerComment}
        >{`${topLevelComments.length} comments`}</div>

        <div
          style={{
            ...styles.commentList,
            overflow: isHovered ? "auto" : "hidden",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <List
            loading={status === "loading" && comments.length === 0}
            itemLayout="vertical"
            size="small"
            split={false}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No Comments Yet"
                />
              ),
            }}
            dataSource={topLevelComments}
            renderItem={(comment) => {
              const username = comment.user_id?.username ?? "Unknown";

              return (
                <List.Item key={comment._id} style={styles.commentItem}>
                  <div style={styles.commentRow}>
                    <Avatar alt="username" size={40} style={styles.avatar}>
                      {username.charAt(0).toUpperCase()}
                    </Avatar>

                    <div style={styles.commentBody}>
                      <Text type="secondary" style={styles.username}>
                        {username}
                      </Text>
                      <Paragraph
                        style={styles.commentText}
                        ellipsis={{
                          rows: 3,
                          expandable: "collapsible",
                          expanded,
                          onExpand: (_, info) => setExpanded(info.expanded),
                          symbol: () =>
                            expanded ? "Show less" : "Read more",
                        }}
                      >
                        {comment.content}
                      </Paragraph>

                      <div style={styles.metaRow}>
                        <Text type="secondary" style={styles.timestamp}>
                          {moment(comment.createdAt).fromNow()}
                        </Text>
                        <Button
                          type="text"
                          size="small"
                          style={styles.actionButton}
                          onClick={() =>
                            setReplyTarget({ commentId: comment._id, username })
                          }
                        >
                          Reply
                        </Button>
                      </div>

                      <ReplyList
                        comments={comments}
                        rootComment={comment}
                        setReplyTarget={setReplyTarget}
                      />
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        </div>

        {error ? (
          <Alert
            message={error.message}
            type="error"
            showIcon
            style={styles.requestError}
          />
        ) : null}

        {replyTarget ? (
          <Space direction="vertical" style={styles.replyBannerWrapper}>
            <Alert
              message={`Replying to ${replyTarget.username}`}
              closable
              type="info"
              showIcon={false}
              afterClose={() => setReplyTarget(null)}
              style={styles.replyBanner}
            />
          </Space>
        ) : null}

        <Form<CommentFormFields>
          form={form}
          layout="inline"
          onFinish={onSubmit}
          autoComplete="off"
          style={styles.footerComment}
        >
          <Form.Item
            style={styles.formItem}
            name="content"
            rules={[{ required: true, message: "Comment is required" }]}
          >
            <TextArea
              placeholder={
                replyTarget
                  ? `Reply to @${replyTarget.username}`
                  : `Add a comment for @${storyOwner}`
              }
              autoSize={{ minRows: 1, maxRows: 3 }}
              size="large"
              maxLength={100}
              allowClear
              style={styles.commentInput}
            />
          </Form.Item>
          <Button
            type="text"
            htmlType="submit"
            style={styles.submitButton}
            loading={status === "loading"}
          >
            Post
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Comment;
