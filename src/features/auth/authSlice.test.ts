import { describe, expect, it, vi } from "vitest";

import {
  authReducer,
  createInitialAuthState,
  signIn,
  signOut,
  signUp,
} from "./authSlice";
import type {
  AuthSession,
  SignInValues,
  SignUpValues,
} from "./auth.types";

const session: AuthSession = {
  result: {
    _id: "user-1",
    username: "kyle",
    email: "kyle@example.com",
  },
  token: "header.payload.signature",
};

const signInValues: SignInValues = {
  email: "kyle@example.com",
  password: "password-1",
};

const signUpValues: SignUpValues = {
  ...signInValues,
  username: "kyle",
  confirmPassword: "password-1",
};

describe("authSlice", () => {
  it("creates initial state from a valid persisted session", () => {
    const storage = {
      getItem: vi.fn(() => JSON.stringify(session)),
    };

    expect(createInitialAuthState(storage)).toEqual({
      user: session.result,
      token: session.token,
      status: "idle",
      error: null,
    });
  });

  it("sets loading and clears a stale error when sign-in starts", () => {
    const state = {
      user: null,
      token: null,
      status: "failed" as const,
      error: { message: "Old failure", status: 500 },
    };

    expect(
      authReducer(state, signIn.pending("request-1", signInValues)),
    ).toEqual({
      user: null,
      token: null,
      status: "loading",
      error: null,
    });
  });

  it("stores the authenticated user and token after sign-in", () => {
    const nextState = authReducer(
      undefined,
      signIn.fulfilled(session, "request-1", signInValues),
    );

    expect(nextState).toEqual({
      user: session.result,
      token: session.token,
      status: "succeeded",
      error: null,
    });
  });

  it("stores the authenticated user and token after sign-up", () => {
    const nextState = authReducer(
      undefined,
      signUp.fulfilled(session, "request-1", signUpValues),
    );

    expect(nextState.user).toEqual(session.result);
    expect(nextState.token).toBe(session.token);
    expect(nextState.status).toBe("succeeded");
    expect(nextState.error).toBeNull();
  });

  it("stores the normalized rejected value after sign-in fails", () => {
    const error = { message: "Password do not match", status: 500 };
    const nextState = authReducer(
      undefined,
      signIn.rejected(
        new Error("Rejected"),
        "request-1",
        signInValues,
        error,
      ),
    );

    expect(nextState.status).toBe("failed");
    expect(nextState.error).toEqual(error);
  });

  it("clears session state on sign-out", () => {
    const authenticatedState = {
      user: session.result,
      token: session.token,
      status: "succeeded" as const,
      error: { message: "Old failure" },
    };

    expect(authReducer(authenticatedState, signOut())).toEqual({
      user: null,
      token: null,
      status: "idle",
      error: null,
    });
  });
});
