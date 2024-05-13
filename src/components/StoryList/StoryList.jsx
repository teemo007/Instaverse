import React from "react";
import { Row, Col, Spin } from "antd";
import Story from "../Story";
import { useSelector } from "react-redux";
import { useState } from "react";

const StoryList = ({ setEditId }) => {
  const stories = useSelector((state) => state.stories);
  const [openedComments, setOpenedComments] = useState({});
  //console.log("stories",stories)
  //console.log("openedComments",openedComments)
  return !stories.length ? (
    <div style={{ textAlign: "center" }}>
      <Spin size="large" />
    </div>
  ) : (
    <Row gutter={[48, 32]}>
      {stories.map((story) => {
        return (
          <Col key={story?._id} lg={24} xl={12} xxl={8}>
            <Story
              {...story}
              setEditId={setEditId}
              openedComments={openedComments}
              setOpenedComments={setOpenedComments}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default StoryList;
