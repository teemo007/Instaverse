import styles from "./styles";
import { Card, Tooltip, Typography, Image, message, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteTwoTone,
  HeartTwoTone,
  HeartFilled,
  MessageOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { deleteStory, likeStory } from "../../actions/stories";
import useStory from "../../hooks/useStory";
import Comment from "../comment/Comment";
import { useEffect, useState } from "react";
import { fetchComments } from "../../actions/comments";
import { useSelector } from "react-redux";

const { Meta } = Card;
const { Link, Paragraph, Text } = Typography;

const Story = (props) => {
  const {
    caption,
    image,
    likes,
    username,
    tags,
    postDate,
    _id,
    //comments,
    openedComments,
    setOpenedComments,
    setEditId,
  } = props;
  //console.log(openedComments[_id])

  const { expand, setExpand, dispatch, navigate, user } = useStory();

  const comments = useSelector(state => state.commentsReducer.comments[_id] )
  //console.log("comments",comments)
  const topLevelComments = comments?.filter((comment) => comment.parentId === null);
  
  //const [commentsFetched, setCommentsFetched] = useState(false);

  const isLiked = likes.includes(user?.result?._id);

  useEffect(() => {
    if (!user) {
      setOpenedComments({});
    }
    if(user){
      dispatch(fetchComments(_id))
    }
  }, [user]);




  const confirm = (e) => {
    dispatch(deleteStory(_id));
    message.success("Story deleted successfully.");
  };
  const cancel = (e) => {
    message.error("Deletion cancelled.");
  };

  const handleOpenComments = () => {
    
    if (!openedComments[_id] /* && !commentsFetched */) {
      dispatch(fetchComments(_id)); // Fetch comments only once
    }

    // Set the current story's comment section to open
    setOpenedComments((prev) => ({ ...prev, [_id]: true }));
    //setCommentsFetched(true)
  };

  // const cleanComments = comments.reduce((acc, comment) => {
  //   const username = comment?.user_id?.username;
  //   const content = comment?.content;
  //   const createdTime = comment?.createdAt;
  //   const simplified = {
  //     username: username,
  //     content: content,
  //     createdTime,
  //   };

  //   acc.push(simplified);
  //   return acc;
  // }, []);

  const cardActions = [
    <div style={styles.actions}>
      <Tooltip
        placement="top"
        title="Like"
        color="magenta"
        onClick={() => {
          if (user) {
            dispatch(likeStory(_id));
          } else {
            navigate("/authForm");
          }
        }}
      >
        {isLiked ? (
          <HeartFilled style={styles.heartFilled} />
        ) : (
          <HeartTwoTone twoToneColor="magenta" />
        )}
        &nbsp; {likes.length} &nbsp;
      </Tooltip>
    </div>,
    <div
      onClick={
        handleOpenComments
      }
    >
      <Tooltip placement="top" title="Comments" color="blue">
        <MessageOutlined />
        &nbsp; {topLevelComments?.length || 0} &nbsp;
      </Tooltip>
    </div>,
    <Tooltip placement="top" title="Edit" color="blue">
      <EditOutlined
        onClick={() => {
          setEditId(_id);
        }}
      />
    </Tooltip>,
    <Tooltip placement="top" title="Delete" color="red">
      <div>
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this story?"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <div>
            <DeleteTwoTone twoToneColor="red" />
          </div>
        </Popconfirm>
      </div>
    </Tooltip>,
  ];

  return (
    <div style={styles.cardContainer}>
      <Card
        style={styles.card}
        cover={<Image src={image} />}
        actions={
          user?.result?._id === props?.userId
            ? cardActions
            : user?.result
            ? cardActions.slice(0, 2)
            : cardActions.slice(0, 1)
        }
      >
        <Meta title={username} />
        <Paragraph
          style={{ margin: 0 }}
          ellipsis={{
            row: 2,
            expandable: true,
            symbol: "Read More",
            onExpand: () => {
              setExpand(true);
            },
            onEllipsis: () => {
              setExpand(false);
            },
          }}
        >
          {caption}
        </Paragraph>
        {expand ? (
          <Link href="#">{tags?.split(" ").map((tag) => `#${tag} `)}</Link>
        ) : null}
        <br />
        <Text type="secondary">{moment(postDate).fromNow()}</Text>
      </Card>
      {openedComments[_id] === true && (
        <Comment
          //comments={topLevelComments}
          storyOwner={username}
          openedComments={openedComments}
          setOpenedComments={setOpenedComments}
          storyId={_id}
          //cleanComments={cleanComments}
        />
      )}
    </div>
  );
};

export default Story;
