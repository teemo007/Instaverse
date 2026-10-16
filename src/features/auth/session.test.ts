import { describe, expect, it } from "vitest";

import { isTokenExpired } from "./session";

const createToken = (payload: object): string =>
  `header.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.signature`;

describe("isTokenExpired", () => {
  it("returns true when exp is before the current time", () => {
    expect(isTokenExpired(createToken({ exp: 99 }), 100)).toBe(true);
  });

  it("returns false when exp is after the current time", () => {
    expect(isTokenExpired(createToken({ exp: 101 }), 100)).toBe(false);
  });

  it("keeps a valid token without exp active", () => {
    expect(isTokenExpired(createToken({ sub: "user-1" }), 100)).toBe(false);
  });

  it("treats a malformed token as expired without throwing", () => {
    expect(() => isTokenExpired("not-a-token", 100)).not.toThrow();
    expect(isTokenExpired("not-a-token", 100)).toBe(true);
  });
});
