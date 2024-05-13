import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Button, Form, Input, Alert, Avatar, Typography } from 'antd';
import { addReply, fetchReplies } from '../../actions/comments';
import moment from 'moment';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const ReplyList = ({ commentId, setReplyContext }) => {
  const dispatch = useDispatch();
  const [showReplies, setShowReplies] = useState(false); // Control showing nested replies
  const replies = useSelector((state) => state.commentsReducer.replies[commentId] || []);
  //console.log("replies",replies)
  //console.log("commentId",commentId)
  // Fetch replies when component is mounted
  useEffect(() => {
    dispatch(fetchReplies(commentId));
  }, [commentId, dispatch]);

  const toggleReplies = () => {
    setShowReplies((prev) => !prev); // Toggle reply visibility
  };

  const onReply = (formValues, parentId) => {
    dispatch(addReply(parentId, formValues));
    setReplyContext(null);
  };

  return (
    <div>
      <Button type="link" onClick={toggleReplies}>
        {showReplies ? 'Hide Replies' : `View ${replies.length} replies`}
      </Button>

      {showReplies && (
        <List
          dataSource={replies}
          renderItem={(reply) => (
            <List.Item key={reply._id}>
              <div>
                <Avatar>{reply.user_id.username.charAt(0).toUpperCase()}</Avatar>
                <Text>{reply.user_id.username}</Text>
                <Paragraph>{reply.content}</Paragraph>
                <Text>{moment(reply.createdAt).fromNow()}</Text>
                <Button
                  type="link"
                  onClick={() => setReplyContext({ [reply._id]: reply.user_id.username })}
                >
                  Reply
                </Button>

                {/* Recursive call to render nested replies */}
                <ReplyList commentId={reply._id} setReplyContext={setReplyContext} />
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ReplyList;