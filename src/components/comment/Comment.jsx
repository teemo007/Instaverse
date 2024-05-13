import React, { useEffect } from "react";
import styles from "./styles";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
  List,
  Button,
  Form,
  Input,
  Typography,
  Avatar,
  Empty,
  Mentions,
  Alert,
  Space,
} from "antd";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import ReplyList from "../reply/ReplyList";
import { useState } from "react";
import { fetchComments, addComment, addReply } from "../../actions/comments";

const { TextArea } = Input;
const { Paragraph, Text } = Typography;


const Comment = ({
  storyOwner,
  openedComments,
  setOpenedComments,
  storyId,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [replyContext, setReplyContext] = useState(null);
  //console.log("replyContext",replyContext);                     
  //const [showReplies, setShowReplies] = useState({});
  //console.log("showReplies", showReplies);
  const dispatch = useDispatch();

  const comments = useSelector(
    (state) => state.commentsReducer.comments[storyId] || []
  );

  const topLevelComments = comments.filter((comment) => comment.parentId === null);

  const [form] = Form.useForm();

  const handleMouseEnter = () => {
    setIsHovered(true); // need to set true
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const onSubmit = (formValues) => {
    // if (openedComments[storyId] && !replyContext) {
    //   dispatch(addComment(storyId, { ...formValues }));
    // }
    // if (replyContext) {
    //   //console.log("ReplyForm", formValues);
    //   console.log("replied",Object.keys(replyContext))
    //   dispatch(addReply(storyId,Object.keys(replyContext), { ...formValues }))
    // }
    if(replyContext) {
      const parentId = Object.keys(replyContext)[0];
      dispatch(addReply(storyId,parentId,{ ...formValues }))
      setReplyContext(null);
    }else {
      dispatch(addComment(storyId, { ...formValues }))
    }
    form.resetFields();
  };

  const handleOutsideClick = (e) => {
    e.stopPropagation();
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div
      style={styles.commentOverlay}
      onClick={() => {
        setOpenedComments((prev) => {
          const newStatus = { ...prev };
          delete newStatus[storyId];
          return newStatus;
        });
      }}
    >
      <div style={styles.commentContent} onClick={handleOutsideClick}>
        <CloseCircleOutlined
          style={styles.exitComment}
          onClick={() => {
            setOpenedComments((prev) => {
              const newStatus = { ...prev };
              delete newStatus[storyId];
              return newStatus;
            });
          }}
        />
        <div style={styles.headerComment}>{`${topLevelComments.length} comments`}</div>
        <List
          loading={comments ? false : true}
          //indicator={<p>loading</p>}
          itemLayout="vertical"
          size="small"
          style={{
            height: "calc(100% - 6.5rem)",
            overflow: isHovered ? "auto" : "hidden",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          bordered
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No Comments Yet"
              />
            ),
          }}
          dataSource={topLevelComments || []}
          renderItem={(comment) => {
            //const hasReplies = comment.replies && comment.replies.length > 0;
            //const shouldShowReplies = showReplies[comment._id];
            return (
              <List.Item key={comment._id}>
                <List.Item.Meta
                  avatar={
                    <Avatar alt="username" size="large">
                      {comment?.user_id?.username?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <div>
                      <Text
                        type="secondary"
                        style={{ display: "block", fontSize: "small" }}
                      >
                        {comment?.user_id?.username}
                      </Text>
                      <Paragraph
                        style={{ margin: 0, fontSize: "medium" }}
                        ellipsis={{
                          row: 1,
                          expandable: "collapsible",
                          expanded,
                          onExpand: (_, info) => {
                            setExpanded(info.expanded);
                          },

                          symbol: () => (expanded ? "Read Less" : "Read More"),
                        }}
                      >
                        {comment.content}
                      </Paragraph>
                      <Text type="secondary">
                        {moment(comment?.createdAt).fromNow()} &nbsp;
                      </Text>
                      <Button
                        type="link"
                        style={{ fontSize: "small" }}
                        onClick={() => {
                          setReplyContext({
                            [comment?._id]: comment?.user_id?.username,
                          });
                          //console.log("replyTo", comment?.user_id?.username);
                        }}
                      >
                        Reply
                      </Button>
                      {/* {hasReplies && (
                        <Button
                          type="link"
                          style={styles.replyWrapper}
                          onClick={() => toggleReplies(comment._id)}
                        >
                          <Text style={styles.divider}>&mdash;&nbsp;</Text>
                          {shouldShowReplies
                            ? "Hide Replies"
                            : `View ${comment.replies.length} more reply`}
                        </Button>
                      )}

                      {shouldShowReplies && (
                        <ReplyList commentId={comment._id} />
                      )} */}
                      <ReplyList commentId={comment._id} setReplyContext={setReplyContext} />
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
        {replyContext && (
          <Space
            direction="vertical"
            style={{
              width: "100%",
            }}
          >
            <Alert
              message={`Replying to ${Object.values(replyContext)}`}
              banner
              closable
              type="info"
              showIcon={false}
              afterClose={() => setReplyContext(null)}
              style={{ zIndex: 11, position: "relative", top: "-2.5rem" }}
            />
          </Space>
        )}
        <Form
          form={form}
          layout="inline"
          onFinish={onSubmit}
          autoComplete="off"
          style={styles.footerComment}
        >
          <Form.Item
            style={{ flex: 1 }}
            name="content"
            rules={[
              {
                required: true,
                message: "comment is required",
              },
              {
                type: "text",
                warningOnly: true,
              },
            ]}
          >
            <TextArea
              placeholder={
                replyContext
                  ? `Reply to @${Object.values(replyContext)}`
                  : `Add a comment for @${storyOwner}`
              }
              autoSize={{
                minRows: 1,
                maxRows: 3,
              }}
              size="large"
              showCount
              maxLength={100}
              allowClear
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Comment;
