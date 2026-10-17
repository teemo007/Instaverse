import { Col, Row, Spin } from "antd";
import { useState } from "react";

import { useAppSelector } from "../../../app/hooks";
import Story from "./Story";
import type { OpenedComments } from "./Story.types";
import styles from "./StoryList.styles";
import type { StoryListProps } from "./StoryList.types";

const StoryList = ({ setEditId }: StoryListProps) => {
  const stories = useAppSelector((state) => state.stories.items);
  const [openedComments, setOpenedComments] = useState<OpenedComments>({});

  if (!stories.length) {
    return (
      <div style={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[48, 32]}>
      {stories.map((story) => (
        <Col key={story._id} lg={24} xl={12} xxl={8}>
          <Story
            {...story}
            setEditId={setEditId}
            openedComments={openedComments}
            setOpenedComments={setOpenedComments}
          />
        </Col>
      ))}
    </Row>
  );
};

export default StoryList;
