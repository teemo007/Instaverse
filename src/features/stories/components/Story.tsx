import {
  DeleteTwoTone,
  EditOutlined,
  HeartFilled,
  HeartTwoTone,
  MessageOutlined,
} from "@ant-design/icons";
import { Card, Image, Popconfirm, Tooltip, Typography, message } from "antd";
import moment from "moment";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Comment from "../../../components/comment/Comment";
import { fetchComments } from "../../comments/commentsSlice";
import { deleteStory, likeStory } from "../storiesSlice";
import styles from "./Story.styles";
import type { StoryProps } from "./Story.types";

const { Meta } = Card;
const { Link, Paragraph, Text } = Typography;

const Story = ({
  caption,
  image,
  likes,
  username,
  userId,
  tags,
  postDate,
  _id,
  openedComments,
  setOpenedComments,
  setEditId,
}: StoryProps) => {
  const [expand, setExpand] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const comments = useAppSelector(
    (state) => state.comments.byStoryId[_id] ?? [],
  );
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null,
  );
  const isLiked = user ? likes.includes(user._id) : false;

  useEffect(() => {
    if (!user) {
      setOpenedComments({});
      return;
    }

    void dispatch(fetchComments(_id));
  }, [dispatch, _id, setOpenedComments, user]);

  const confirmDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteStory(_id)).unwrap();
      void message.success("Story deleted successfully.");
    } catch {
      void message.error("Unable to delete story.");
    }
  };

  const handleOpenComments = (): void => {
    if (!openedComments[_id]) {
      void dispatch(fetchComments(_id));
    }

    setOpenedComments((current) => ({ ...current, [_id]: true }));
  };

  const cardActions: ReactNode[] = [
    <div
      key="like"
      style={styles.actions}
      onClick={() => {
        if (user) {
          void dispatch(likeStory(_id));
        } else {
          navigate("/authForm");
        }
      }}
    >
      <Tooltip
        placement="top"
        title="Like"
        color="magenta"
      >
        {isLiked ? (
          <HeartFilled style={styles.heartFilled} />
        ) : (
          <HeartTwoTone twoToneColor="magenta" />
        )}
        &nbsp; {likes.length} &nbsp;
      </Tooltip>
    </div>,
    <div key="comments" onClick={handleOpenComments}>
      <Tooltip placement="top" title="Comments" color="blue">
        <MessageOutlined />
        &nbsp; {topLevelComments.length} &nbsp;
      </Tooltip>
    </div>,
    <Tooltip key="edit" placement="top" title="Edit" color="blue">
      <EditOutlined onClick={() => setEditId(_id)} />
    </Tooltip>,
    <Tooltip key="delete" placement="top" title="Delete" color="red">
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this story?"
        onConfirm={confirmDelete}
        onCancel={() => void message.error("Deletion cancelled.")}
        okText="Yes"
        cancelText="No"
      >
        <DeleteTwoTone twoToneColor="red" />
      </Popconfirm>
    </Tooltip>,
  ];

  const visibleActions =
    user?._id === userId
      ? cardActions
      : user
        ? cardActions.slice(0, 2)
        : cardActions.slice(0, 1);

  return (
    <div style={styles.cardContainer}>
      <Card
        style={styles.card}
        cover={<Image src={image} />}
        actions={visibleActions}
      >
        <Meta title={username} />
        <Paragraph
          style={{ margin: 0 }}
          ellipsis={{
            rows: 2,
            expandable: true,
            symbol: "Read More",
            onExpand: () => setExpand(true),
            onEllipsis: () => setExpand(false),
          }}
        >
          {caption}
        </Paragraph>
        {expand && tags ? (
          <Link href="#">{tags.split(" ").map((tag) => `#${tag} `)}</Link>
        ) : null}
        <br />
        <Text type="secondary">{moment(postDate).fromNow()}</Text>
      </Card>

      {openedComments[_id] ? (
        <Comment
          storyOwner={username}
          setOpenedComments={setOpenedComments}
          storyId={_id}
        />
      ) : null}
    </div>
  );
};

export default Story;
