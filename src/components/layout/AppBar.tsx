import { Avatar, Button, Image, Layout, Typography } from "antd";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import logo from "../../assets/Instaverse.png";
import { clearStoredAuth } from "../../features/auth/authPersistence";
import { isTokenExpired } from "../../features/auth/session";
import { signOut } from "../../features/auth/authSlice";
import styles from "./AppBar.styles";

const { Header } = Layout;
const { Title } = Typography;

const AppBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, user } = useAppSelector((state) => state.auth);

  const handleSignOut = (): void => {
    clearStoredAuth();
    dispatch(signOut());
    navigate("/");
  };

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      clearStoredAuth();
      dispatch(signOut());
      navigate("/");
    }
  }, [dispatch, navigate, token]);

  return (
    <Header style={styles.header}>
      <Link to="/">
        <div style={styles.homeLink}>
          <Image style={styles.image} width={45} preview={false} src={logo} />
          &nbsp;
          <Title style={styles.title}>Instaverse</Title>
        </div>
      </Link>

      {!user ? (
        <Link to="/authForm" state={{ mode: "signIn" }}>
          <Button htmlType="button" style={styles.login}>
            Sign in
          </Button>
        </Link>
      ) : (
        <div style={styles.userInfo}>
          <Avatar style={styles.avatar} alt="username" size="large">
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Title style={styles.title} level={4}>
            {user.username}
          </Title>
          <Button onClick={handleSignOut} htmlType="button">
            Sign Out
          </Button>
        </div>
      )}
    </Header>
  );
};

export default AppBar;
