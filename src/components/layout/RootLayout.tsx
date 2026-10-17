import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import AppBar from "./AppBar";
import styles from "./Layout.styles";

const { Footer } = Layout;

const RootLayout = () => (
  <Layout style={styles.layout}>
    <AppBar />
    <Outlet />
    <Footer style={styles.footer}>2024 Instaverse</Footer>
  </Layout>
);

export default RootLayout;
