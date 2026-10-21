import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  apiClient,
  registerCsrfTokenGetter,
  registerUnauthorizedHandler,
} from "./client";
import { normalizeApiError } from "./errors";

const createAxiosError = (
  data: unknown,
  status: number,
): AxiosError<unknown> => {
  const config = { headers: new AxiosHeaders() } as InternalAxiosRequestConfig;
  const response: AxiosResponse<unknown> = {
    data,
    status,
    statusText: "Request failed",
    headers: {},
    config,
  };
  return new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, undefined, response);
};

afterEach(() => {
  registerCsrfTokenGetter(null);
  registerUnauthorizedHandler(null);
});

describe("normalizeApiError", () => {
  it("keeps backend message, status, and stable code", () => {
    expect(
      normalizeApiError(
        createAxiosError(
          { message: "Sign in required.", code: "UNAUTHENTICATED" },
          401,
        ),
      ),
    ).toEqual({
      message: "Sign in required.",
      status: 401,
      code: "UNAUTHENTICATED",
    });
  });

  it("keeps legacy and plain-text backend messages", () => {
    expect(normalizeApiError(createAxiosError({ msg: "Old error" }, 400))).toEqual({
      message: "Old error",
      status: 400,
    });
    expect(normalizeApiError(createAxiosError("Story not found", 404))).toEqual({
      message: "Story not found",
      status: 404,
    });
  });

  it("normalizes non-Axios failures without serializing details", () => {
    expect(normalizeApiError(new Error("Network unavailable"))).toEqual({
      message: "Network unavailable",
    });
    expect(normalizeApiError({ reason: "internal detail" })).toEqual({
      message: "Something went wrong",
    });
  });
});

describe("apiClient", () => {
  it("uses the same-origin API path and credentials without Authorization", () => {
    expect(apiClient.defaults.baseURL).toBe("/api");
    expect(apiClient.defaults.withCredentials).toBe(true);
    expect(apiClient.defaults.headers.common.Authorization).toBeUndefined();
  });

  it("attaches in-memory CSRF only to unsafe methods", async () => {
    registerCsrfTokenGetter(() => "csrf-token");
    const seen: Array<{ method?: string; csrf?: string }> = [];
    const adapter = async (config: InternalAxiosRequestConfig) => {
      seen.push({
        method: config.method,
        csrf: config.headers.get("X-CSRF-Token") as string | undefined,
      });
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    };

    await apiClient.get("/safe", { adapter });
    await apiClient.post("/unsafe", {}, { adapter });

    expect(seen).toEqual([
      { method: "get", csrf: undefined },
      { method: "post", csrf: "csrf-token" },
    ]);
  });

  it("clears authenticated state once on a 401", async () => {
    const unauthorized = vi.fn();
    registerCsrfTokenGetter(() => "csrf-token");
    registerUnauthorizedHandler(unauthorized);

    await expect(
      apiClient.get("/protected", {
        adapter: async () => {
          throw createAxiosError({ message: "Sign in required." }, 401);
        },
      }),
    ).rejects.toEqual({ message: "Sign in required.", status: 401 });
    expect(unauthorized).toHaveBeenCalledTimes(1);
  });
});
