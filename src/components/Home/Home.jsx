import React, { useEffect, useState } from "react";
import StoryList from "../StoryList";
import StoryForm from "../StoryForm/";
import { Layout } from "antd";
import styles from "./styles";
import { useDispatch } from "react-redux";
import { getStories } from "../../actions/stories";

const { Sider, Content } = Layout;

const Home = () => {
  const dispatch = useDispatch();
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getStories());
  }, [dispatch]);

  return (
    <Layout>
      <Sider style={styles.sider} width={400}>
        <StoryForm editId={editId} setEditId={setEditId} />
      </Sider>
      <Content style={styles.content}>
        <StoryList setEditId={setEditId} />
      </Content>
    </Layout>
  );
};

export default Home;
