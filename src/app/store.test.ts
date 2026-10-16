import { describe, expect, it } from "vitest";

import { signIn, signOut } from "../features/auth/authSlice";
import type { AuthSession } from "../features/auth/auth.types";
import { store } from "./store";

const session: AuthSession = {
  result: {
    _id: "user-1",
    username: "kyle",
    email: "kyle@example.com",
  },
  token: "header.payload.signature",
};

describe("store", () => {
  it("contains exactly the three domain slices", () => {
    expect(Object.keys(store.getState()).sort()).toEqual([
      "auth",
      "comments",
      "stories",
    ]);
  });

  it("sign-out updates only auth state", () => {
    store.dispatch(
      signIn.fulfilled(session, "request-1", {
        email: "kyle@example.com",
        password: "password-1",
      }),
    );
    const stateBeforeSignOut = store.getState();

    store.dispatch(signOut());

    const stateAfterSignOut = store.getState();
    expect(stateAfterSignOut.auth.user).toBeNull();
    expect(stateAfterSignOut.auth.token).toBeNull();
    expect(stateAfterSignOut.stories).toBe(stateBeforeSignOut.stories);
    expect(stateAfterSignOut.comments).toBe(stateBeforeSignOut.comments);
  });
});
