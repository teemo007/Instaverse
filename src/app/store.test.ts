import { describe, expect, it } from "vitest";

import { sessionExpired, signIn } from "../features/auth/authSlice";
import type { AuthSession } from "../features/auth/auth.types";
import { store } from "./store";

const session: AuthSession = {
  user: {
    _id: "user-1",
    username: "kyle",
    email: "kyle@example.com",
  },
  csrfToken: "csrf-token",
};

describe("store", () => {
  it("contains exactly the three domain slices", () => {
    expect(Object.keys(store.getState()).sort()).toEqual([
      "auth",
      "comments",
      "stories",
    ]);
  });

  it("an authenticated 401 updates only in-memory auth state", () => {
    store.dispatch(
      signIn.fulfilled(session, "request-1", {
        email: "kyle@example.com",
        password: "password-1",
      }),
    );
    const stateBeforeExpiry = store.getState();

    store.dispatch(sessionExpired());

    const stateAfterExpiry = store.getState();
    expect(stateAfterExpiry.auth.user).toBeNull();
    expect(stateAfterExpiry.auth.csrfToken).toBeNull();
    expect(stateAfterExpiry.stories).toBe(stateBeforeExpiry.stories);
    expect(stateAfterExpiry.comments).toBe(stateBeforeExpiry.comments);
  });
});
