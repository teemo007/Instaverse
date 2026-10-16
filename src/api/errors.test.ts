import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { describe, expect, it } from "vitest";

import { normalizeApiError } from "./errors";

const createAxiosError = (
  data: unknown,
  status: number,
): AxiosError<unknown> => {
  const config = {
    headers: new AxiosHeaders(),
  } as InternalAxiosRequestConfig;
  const response: AxiosResponse<unknown> = {
    data,
    status,
    statusText: "Request failed",
    headers: {},
    config,
  };

  return new AxiosError(
    "Request failed",
    "ERR_BAD_RESPONSE",
    config,
    undefined,
    response,
  );
};

describe("normalizeApiError", () => {
  it("uses the backend msg and status from an Axios response", () => {
    expect(
      normalizeApiError(
        createAxiosError({ msg: "Password do not match" }, 500),
      ),
    ).toEqual({
      message: "Password do not match",
      status: 500,
    });
  });

  it("keeps an ordinary Error message without serializing the Error", () => {
    expect(normalizeApiError(new Error("Network unavailable"))).toEqual({
      message: "Network unavailable",
    });
  });

  it("uses a rejected string as the safe message", () => {
    expect(normalizeApiError("Request cancelled")).toEqual({
      message: "Request cancelled",
    });
  });

  it("falls back for rejection values without a safe message", () => {
    expect(normalizeApiError({ reason: "internal detail" })).toEqual({
      message: "Something went wrong",
    });
    expect(normalizeApiError(null)).toEqual({
      message: "Something went wrong",
    });
  });
});
