import React, { useState } from "react";
import { Form, Input, Button, Card, Layout, Typography } from "antd";
import styles from "./styles";
import { UserOutlined, SafetyOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signin, signup } from "../../actions/authentication";
import { ISLOGIN } from "../../constants/actionType";

const { Title } = Typography;

const Authform = () => {
  //const user = null;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.storyformReduecer.islogin);

  const onSubmit = (formValues) => {
    if (isLogin) {
      dispatch(signin(formValues, navigate));
    } else {
      dispatch(signup(formValues, navigate));
    }
  };

  const switchMode = () => {
    dispatch({ type: ISLOGIN, payload: !isLogin });
  };

  return (
    <Layout style={styles.container}>
      <Card
        style={styles.card}
        title={
          <Title level={4} style={styles.title}>
            {isLogin ? "Login to" : "Join"} Instaverse
          </Title>
        }
      >
        <Form
          name="authform"
          form={form}
          size="large"
          wrapperCol={{ span: 20, offset: 2 }}
          onFinish={onSubmit}
        >
          {isLogin || (
            <>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please enter your username.",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
            </>
          )}
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
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password.",
              },
            ]}
          >
            <Input.Password
              type="passowrd"
              prefix={<SafetyOutlined />}
              placeholder="password"
            />
          </Form.Item>

          {isLogin || (
            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please re-enter your password.",
                },
              ]}
            >
              <Input.Password
                type="passowrd"
                prefix={<SafetyOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button htmlType="submit" typeof="primary">
              {isLogin ? "Sign In" : "Join"}
            </Button>
            <span style={{ margin: "0px 10px 0px 20px" }}>Or</span>
            <Button type="link" onClick={switchMode}>
              {isLogin ? "Register now" : "Have an account?"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default Authform;
