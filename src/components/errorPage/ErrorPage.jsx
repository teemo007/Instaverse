import { useRouteError, Link } from "react-router-dom";
import styles from "./styles";
import { Button, Typography, Flex} from "antd";

const { Title } = Typography;

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div style={styles.errorWrapper}>
      <Flex gap="middle" align="center" vertical>
        <Title level={1}>Oops!</Title>
        <Title level={3}>Sorry, an unexpected error has occurred.</Title>
        <Title level={4}>
          <i>{error.statusText || error.message}</i>
        </Title>
        <Title level={5}>
          <Button type="link" size="large">
            <Link>Home</Link>
          </Button>
        </Title>
      </Flex>
    </div>
  );
};

export default ErrorPage;
