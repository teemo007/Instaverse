import { useRouteError } from "react-router-dom";

import { Button, Typography, Result } from "antd";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <Result
      status="404"
      title={<i>{error.statusText || error.message}</i>}
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="link" href="/">
          Back Home
        </Button>
      }
    />
  );
};

export default ErrorPage;
