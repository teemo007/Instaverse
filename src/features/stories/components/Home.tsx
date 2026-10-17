import { Layout } from "antd";
import { useEffect, useState } from "react";

import { useAppDispatch } from "../../../app/hooks";
import { fetchStories } from "../storiesSlice";
import styles from "./Home.styles";
import StoryForm from "./StoryForm";
import StoryList from "./StoryList";

const { Content, Sider } = Layout;

const Home = () => {
  const dispatch = useAppDispatch();
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchStories());
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
