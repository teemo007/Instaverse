import { Layout } from "antd";
import styles from "../styles";
import appbarStyles from "../components/AppBar/styles";
import AppBar from "../components/AppBar/AppBar";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AuthForm from "../components/authForm/Authform";
import Home from "../components/Home/Home";
import ErrorPage from "../components/errorPage/ErrorPage";

const { Footer } = Layout;

const router = createBrowserRouter([
  {
    element: (
      <>
        <Layout style={styles.layout}>
          <AppBar />
          <Outlet />
          <Footer style={styles.footer}>2024 Instaverse</Footer>
        </Layout>
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/authForm",
        element: <AuthForm />,
      },
    ],
  },
]);

const Routers = () => {
  return <RouterProvider router={router} />;
};

export default Routers;
