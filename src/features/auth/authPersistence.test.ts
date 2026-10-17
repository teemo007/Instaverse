import { describe, expect, it, vi } from "vitest";

import {
  clearStoredAuth,
  loadStoredAuth,
  saveStoredAuth,
} from "./authPersistence";
import type { AuthSession } from "./auth.types";

const session: AuthSession = {
  result: {
    _id: "user-1",
    username: "kyle",
    email: "kyle@example.com",
  },
  token: "header.payload.signature",
};

describe("auth persistence", () => {
  it("loads a structurally valid stored session", () => {
    const storage = {
      getItem: vi.fn(() => JSON.stringify(session)),
    };

    expect(loadStoredAuth(storage)).toEqual(session);
    expect(storage.getItem).toHaveBeenCalledWith("profile");
  });

  it("returns null for malformed JSON", () => {
    const storage = { getItem: vi.fn(() => "{not-json") };

    expect(loadStoredAuth(storage)).toBeNull();
  });

  it("returns null when required session fields are missing", () => {
    const withoutToken = {
      result: session.result,
    };
    const withoutUser = {
      token: session.token,
    };

    expect(
      loadStoredAuth({ getItem: vi.fn(() => JSON.stringify(withoutToken)) }),
    ).toBeNull();
    expect(
      loadStoredAuth({ getItem: vi.fn(() => JSON.stringify(withoutUser)) }),
    ).toBeNull();
  });

  it("saves only under the profile key", () => {
    const storage = { setItem: vi.fn() };

    saveStoredAuth(session, storage);

    expect(storage.setItem).toHaveBeenCalledOnce();
    expect(storage.setItem).toHaveBeenCalledWith(
      "profile",
      JSON.stringify(session),
    );
  });

  it("clears only the profile key", () => {
    const storage = { removeItem: vi.fn() };

    clearStoredAuth(storage);

    expect(storage.removeItem).toHaveBeenCalledOnce();
    expect(storage.removeItem).toHaveBeenCalledWith("profile");
  });
});
