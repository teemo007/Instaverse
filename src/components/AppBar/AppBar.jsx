import { Layout, Typography, Button, Avatar, Image } from "antd";
import logo from "../../assets/Instaverse.png";
import styles from "./styles";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SIGNOUT } from "../../constants/actionType";
import { jwtDecode } from "jwt-decode";

const { Header } = Layout;
const { Title } = Typography;

const AppBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token)
      if(decodedToken.exp * 1000 < new Date().getTime()) signOut()

    }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  const signOut = () => {
    dispatch({ type: SIGNOUT });
    navigate("/");
    setUser(null)
  };
  return (
    <Header style={styles.header}>
      <Link to="/">
        <div style={styles.homeLink}>
          <Image style={styles.image} width="45" preview="false" src={logo} />
          &nbsp;
          <Title style={styles.title}>Instaverse</Title>
        </div>
      </Link>
      {!user ? (
        <Link to="/authform">
          <Button htmlType="button" style={styles.login}>
            Sign in
          </Button>
        </Link>
      ) : (
        <div style={styles.userInfo}>
          <Avatar style={styles.avatar} alt="username" size="large">
            {user?.result?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Title style={styles.title} level={4}>
            {user?.result?.username}
          </Title>
          <Button onClick={signOut} htmlType="button">
            Sign Out
          </Button>
        </div>
      )}
    </Header>
  );
};

export default AppBar;
