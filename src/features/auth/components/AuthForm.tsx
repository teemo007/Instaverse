import {
  MailOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Layout, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { signIn, signUp } from "../authSlice";
import type { SignInValues, SignUpValues } from "../auth.types";
import styles from "./AuthForm.styles";
import type { AuthFormFields } from "./AuthForm.types";

const { Title } = Typography;

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm<AuthFormFields>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, status } = useAppSelector((state) => state.auth);

  const onSubmit = async (values: AuthFormFields): Promise<void> => {
    try {
      if (isLogin) {
        const credentials: SignInValues = {
          email: values.email,
          password: values.password,
        };
        await dispatch(signIn(credentials)).unwrap();
      } else {
        if (!values.username || !values.confirmPassword) {
          return;
        }

        const registration: SignUpValues = {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        };
        await dispatch(signUp(registration)).unwrap();
      }

      form.resetFields();
      navigate("/");
    } catch {
      // The rejected thunk stores the normalized error in the auth slice.
    }
  };

  const switchMode = (): void => {
    setIsLogin((currentMode) => !currentMode);
    form.resetFields();
  };

  return (
    <Layout style={styles.container}>
      {error ? (
        <Alert
          message={error.message}
          type="error"
          showIcon
          closable
          style={styles.alert}
        />
      ) : null}

      <Card
        style={styles.card}
        title={
          <Title level={4} style={styles.title}>
            {isLogin ? "Login to" : "Join"} Instaverse
          </Title>
        }
      >
        <Form<AuthFormFields>
          name="authform"
          form={form}
          size="large"
          wrapperCol={{ span: 20, offset: 2 }}
          onFinish={onSubmit}
        >
          {!isLogin ? (
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your username." },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
          ) : null}

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter valid email address.",
              },
            ]}
          >
            <Input
              type="email"
              prefix={<MailOutlined />}
              placeholder="Email Address"
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password." },
            ]}
          >
            <Input.Password
              prefix={<SafetyOutlined />}
              placeholder="Password"
              allowClear
            />
          </Form.Item>

          {!isLogin ? (
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please re-enter your password." },
                ({ getFieldValue }) => ({
                  validator(_, value: string | undefined) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match."),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<SafetyOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>
          ) : null}

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={status === "loading"}
            >
              {isLogin ? "Sign In" : "Join"}
            </Button>
            <span style={{ margin: "0 10px 0 20px" }}>Or</span>
            <Button type="link" onClick={switchMode}>
              {isLogin ? "Register now" : "Have an account?"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default AuthForm;
