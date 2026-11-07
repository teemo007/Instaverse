import { HeartFilled, MessageOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import KapsuleMark from "../../../components/ui/KapsuleMark";
import Wordmark from "../../../components/ui/Wordmark";
import { clearAuthError, signIn, signUp } from "../authSlice";
import type { SignInValues, SignUpValues } from "../auth.types";
import styles from "./AuthForm.module.css";
import type { AuthFormFields, AuthRouteState } from "./AuthForm.types";
import GoogleSignInButton from "./GoogleSignInButton";

const Hero = () => (
  <div className={styles.hero} aria-hidden="true">
    <div className={styles.heroGlow} />
    <div className={`${styles.heroCard} ${styles.heroCardBack}`} />
    <div className={`${styles.heroCard} ${styles.heroCardFront}`}>
      <div className={styles.heroHeader}>
        <span className={styles.heroDot} />
        kapsule
      </div>
      <div className={styles.heroPhoto} />
      <div className={styles.heroBar}>
        <HeartFilled className={styles.heroLike} />
        <MessageOutlined />
        <SendOutlined />
      </div>
    </div>
    <KapsuleMark className={styles.heroLogo} size={104} />
  </div>
);

const AuthForm = () => {
  const location = useLocation();
  const routeState = location.state as AuthRouteState | null;
  const [isLogin, setIsLogin] = useState(routeState?.mode !== "signUp");
  const [form] = Form.useForm<AuthFormFields>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, status, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsLogin(routeState?.mode !== "signUp");
    form.resetFields();
  }, [routeState?.mode, form]);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(
    () => () => {
      dispatch(clearAuthError());
    },
    [dispatch],
  );

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
    dispatch(clearAuthError());
  };

  return (
    <div className={styles.page}>
      <Hero />

      <div className={styles.column}>
        <div className={`${styles.box} ${styles.formBox}`}>
          <Link to="/" className={styles.brand} aria-label="Kapsule home">
            <KapsuleMark size={56} />
            <Wordmark className={styles.wordmark} />
          </Link>
          <p className={styles.tagline}>A time capsule for your moments.</p>
          {!isLogin ? (
            <p className={styles.subtitle}>
              Sign up to seal your everyday moments, and the big ones too.
            </p>
          ) : null}

          <Form<AuthFormFields>
            name="authform"
            form={form}
            className={styles.form}
            onFinish={onSubmit}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email address.",
                },
              ]}
            >
              <Input
                className={styles.input}
                type="email"
                autoComplete="email"
                aria-label="Email address"
                placeholder="Email address"
              />
            </Form.Item>

            {!isLogin ? (
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Please enter your username." }]}
              >
                <Input
                  className={styles.input}
                  autoComplete="username"
                  aria-label="Username"
                  placeholder="Username"
                />
              </Form.Item>
            ) : null}

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password." }]}
            >
              <Input.Password
                className={styles.input}
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-label="Password"
                placeholder="Password"
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
                  className={styles.input}
                  autoComplete="new-password"
                  aria-label="Confirm password"
                  placeholder="Confirm password"
                />
              </Form.Item>
            ) : null}

            <Button
              className={styles.submit}
              htmlType="submit"
              type="primary"
              block
              loading={status === "loading"}
            >
              {isLogin ? "Log in" : "Sign up"}
            </Button>
          </Form>

          <div className={styles.divider}>OR</div>

          <div className={styles.google}>
            <GoogleSignInButton />
          </div>

          {error ? (
            <p className={styles.error} role="alert">
              {error.message}
            </p>
          ) : null}
        </div>

        <div className={`${styles.box} ${styles.switch}`}>
          {isLogin ? "Don't have an account? " : "Have an account? "}
          <button type="button" className={styles.switchButton} onClick={switchMode}>
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>

        <p className={styles.guest}>
          Just looking? <Link to="/">Browse the feed</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
