import { Button, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { AppError } from "../../../api/api.types";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearAuthError,
  linkGoogle,
  signInWithGoogle,
} from "../authSlice";
import {
  initializeGoogleIdentity,
  loadGoogleIdentityScript,
  renderGoogleButton,
} from "../googleIdentity";
import type { GoogleLinkFields } from "./AuthForm.types";
import styles from "./GoogleSignInButton.module.css";

const isAppError = (value: unknown): value is AppError =>
  typeof value === "object" &&
  value !== null &&
  "message" in value &&
  typeof value.message === "string";

const GoogleSignInButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector((state) => state.auth.status);
  const buttonContainer = useRef<HTMLDivElement>(null);
  const credential = useRef<string | null>(null);
  const active = useRef(true);
  const [linkRequired, setLinkRequired] = useState(false);
  const [fields, setFields] = useState<GoogleLinkFields>({ password: "" });
  const [localError, setLocalError] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    active.current = true;
    const container = buttonContainer.current;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
    if (!clientId) {
      setSetupError("Google Sign-In is not configured.");
      return () => {
        active.current = false;
        credential.current = null;
      };
    }

    void loadGoogleIdentityScript()
      .then(() => {
        if (!active.current || !container) return;
        initializeGoogleIdentity({
          client_id: clientId,
          callback: (response) => {
            if (!active.current || !response.credential) return;
            const receivedCredential = response.credential;
            void dispatch(signInWithGoogle(receivedCredential))
              .unwrap()
              .then(() => {
                if (!active.current) return;
                credential.current = null;
                navigate("/");
              })
              .catch((error: unknown) => {
                if (
                  !active.current ||
                  !isAppError(error) ||
                  error.code !== "ACCOUNT_LINK_REQUIRED"
                ) {
                  return;
                }
                credential.current = receivedCredential;
                setLinkRequired(true);
                setLocalError(null);
                dispatch(clearAuthError());
              });
          },
        });
        renderGoogleButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: 268,
        });
      })
      .catch(() => {
        if (active.current) {
          setSetupError("Google Sign-In could not be loaded.");
        }
      });

    return () => {
      active.current = false;
      credential.current = null;
      container?.replaceChildren();
    };
  }, [dispatch, navigate]);

  const submitLink = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const pendingCredential = credential.current;
    if (!pendingCredential || !fields.password) return;

    setLocalError(null);
    try {
      await dispatch(linkGoogle({
        credential: pendingCredential,
        password: fields.password,
      })).unwrap();
      credential.current = null;
      setFields({ password: "" });
      setLinkRequired(false);
      navigate("/");
    } catch (error) {
      if (isAppError(error)) {
        setLocalError(error.message);
        dispatch(clearAuthError());
      }
    }
  };

  if (setupError) {
    return (
      <p className={styles.notice} role="alert">
        {setupError}
      </p>
    );
  }

  if (linkRequired) {
    return (
      <form className={styles.link} onSubmit={(event) => void submitLink(event)}>
        <p className={styles.linkTitle}>Link your Google account</p>
        <p className={styles.linkText}>
          Enter your existing password to link this Google account.
        </p>
        <label className={styles.label} htmlFor="google-link-password">
          Existing account password
        </label>
        <Input.Password
          id="google-link-password"
          autoComplete="current-password"
          autoFocus
          value={fields.password}
          onChange={(event) => setFields({ password: event.target.value })}
        />
        {localError ? (
          <p className={styles.error} role="alert">
            {localError}
          </p>
        ) : null}
        <Button
          type="primary"
          block
          htmlType="submit"
          loading={status === "loading"}
          disabled={!fields.password}
        >
          Link Google
        </Button>
      </form>
    );
  }

  return <div aria-label="Sign in with Google" ref={buttonContainer} />;
};

export default GoogleSignInButton;
