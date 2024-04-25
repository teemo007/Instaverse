import styles from "./styles";
import { Card, Tooltip, Typography, Image, message, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteTwoTone,
  HeartTwoTone,
  HeartFilled,
  CommentOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { deleteStory } from "../../actions/stories";
import { likeStroy } from "../../actions/stories";
import useStory from "../../hooks/useStory";
import Comment from "../comment/Comment";

const { Meta } = Card;
const { Link, Paragraph, Text } = Typography;

const Story = (props) => {
  const { caption, image, likes, username, tags, postDate, _id } = props;

  const {
    expand,
    setExpand,
    dispatch,
    navigate,
    showComment,
    setShowComment,
    user,
  } = useStory();

  const confirm = (e) => {
    dispatch(deleteStory(_id));
    message.success("Click on Yes");
  };
  const cancel = (e) => {
    //console.log(e);
    message.error("Click on No");
  };

  const isLiked = likes.includes(user?.result?._id);

  const cardActions = [
    <div style={styles.actions}>
      <Tooltip
        placement="top"
        title="Like"
        color="magenta"
        onClick={() => {
          if (user) {
            dispatch(likeStroy(_id));
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
    <Tooltip placement="top" title="Comments" color="blue">
      <CommentOutlined
        onClick={() => {
          setShowComment((prev) => !prev);
        }}
      />
    </Tooltip>,
    <Tooltip placement="top" title="Edit" color="blue">
      <EditOutlined
        onClick={() => {
          props.setSelectedId(_id);
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
          <DeleteTwoTone twoToneColor="red" />
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
            ? cardActions.slice(0, 1)
            : !user
            ? cardActions.slice(0, 1)
            : null
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
      {showComment && <Comment setShowComment={setShowComment} />}
    </div>
  );
};

export default Story;
