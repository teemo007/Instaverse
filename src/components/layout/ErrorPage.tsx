import { Button, Result } from "antd";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText ||
      (typeof error.data === "string" ? error.data : "Page not found")
    : error instanceof Error
      ? error.message
      : "Page not found";

  return (
    <Result
      status="404"
      title={<i>{message}</i>}
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
