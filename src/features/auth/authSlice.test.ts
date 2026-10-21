import { describe, expect, it, vi } from "vitest";

import {
  authReducer,
  createInitialAuthState,
  restoreSession,
  sessionExpired,
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
  user: {
    _id: "user-1",
    username: "kyle",
    email: "kyle@example.com",
  },
  csrfToken: "csrf-token",
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
  it("starts anonymous and uninitialized without reading localStorage", () => {
    const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    const getItem = vi.fn();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem },
    });
    try {
      expect(createInitialAuthState()).toEqual({
        user: null,
        csrfToken: null,
        status: "idle",
        initialized: false,
        error: null,
      });
      expect(getItem).not.toHaveBeenCalled();
    } finally {
      if (originalStorage) {
        Object.defineProperty(globalThis, "localStorage", originalStorage);
      } else {
        Reflect.deleteProperty(globalThis, "localStorage");
      }
    }
  });

  it("keeps the app gated while session restoration is pending", () => {
    const nextState = authReducer(
      undefined,
      restoreSession.pending("restore-1", undefined),
    );

    expect(nextState.initialized).toBe(false);
    expect(nextState.status).toBe("loading");
  });

  it("stores the in-memory user and CSRF token after restore", () => {
    expect(
      authReducer(
        undefined,
        restoreSession.fulfilled(session, "restore-1", undefined),
      ),
    ).toEqual({
      user: session.user,
      csrfToken: session.csrfToken,
      status: "succeeded",
      initialized: true,
      error: null,
    });
  });

  it("treats a restore 401 as an initialized anonymous session", () => {
    const nextState = authReducer(
      undefined,
      restoreSession.rejected(
        new Error("Rejected"),
        "restore-1",
        undefined,
        { message: "Sign in required.", status: 401, code: "UNAUTHENTICATED" },
      ),
    );

    expect(nextState).toEqual({
      user: null,
      csrfToken: null,
      status: "idle",
      initialized: true,
      error: null,
    });
  });

  it("keeps restore network failures visible without rendering the app shell", () => {
    const error = { message: "Network unavailable" };
    const nextState = authReducer(
      undefined,
      restoreSession.rejected(
        new Error("Rejected"),
        "restore-1",
        undefined,
        error,
      ),
    );

    expect(nextState.initialized).toBe(false);
    expect(nextState.status).toBe("failed");
    expect(nextState.error).toEqual(error);
  });

  it("stores session responses after sign-in and sign-up", () => {
    for (const action of [
      signIn.fulfilled(session, "request-1", signInValues),
      signUp.fulfilled(session, "request-2", signUpValues),
    ]) {
      const nextState = authReducer(undefined, action);
      expect(nextState.user).toEqual(session.user);
      expect(nextState.csrfToken).toBe(session.csrfToken);
      expect(nextState.initialized).toBe(true);
      expect(nextState.status).toBe("succeeded");
    }
  });

  it("does not clear authentication until server sign-out succeeds", () => {
    const authenticatedState = {
      user: session.user,
      csrfToken: session.csrfToken,
      status: "succeeded" as const,
      initialized: true,
      error: null,
    };

    const pending = authReducer(
      authenticatedState,
      signOut.pending("signout-1", undefined),
    );
    expect(pending.user).toEqual(session.user);
    expect(pending.csrfToken).toBe(session.csrfToken);

    const fulfilled = authReducer(
      pending,
      signOut.fulfilled(undefined, "signout-1", undefined),
    );
    expect(fulfilled).toEqual({
      user: null,
      csrfToken: null,
      status: "idle",
      initialized: true,
      error: null,
    });
  });

  it("clears stale authenticated state after an authenticated 401", () => {
    const state = {
      user: session.user,
      csrfToken: session.csrfToken,
      status: "succeeded" as const,
      initialized: true,
      error: null,
    };

    expect(authReducer(state, sessionExpired())).toEqual({
      user: null,
      csrfToken: null,
      status: "idle",
      initialized: true,
      error: null,
    });
  });
});
