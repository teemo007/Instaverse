import axios from "axios";

import { normalizeApiError } from "./errors";

type CsrfTokenGetter = () => string | null;
type UnauthorizedHandler = () => void;

const UNSAFE_METHODS = new Set(["delete", "patch", "post", "put"]);

let getCsrfToken: CsrfTokenGetter | null = null;
let handleUnauthorized: UnauthorizedHandler | null = null;

export const registerCsrfTokenGetter = (
  getter: CsrfTokenGetter | null,
): void => {
  getCsrfToken = getter;
};

export const registerUnauthorizedHandler = (
  handler: UnauthorizedHandler | null,
): void => {
  handleUnauthorized = handler;
};

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase() ?? "get";
  if (UNSAFE_METHODS.has(method)) {
    const csrfToken = getCsrfToken?.();
    if (csrfToken) {
      config.headers.set("X-CSRF-Token", csrfToken);
    }
    if (!config.headers.has("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const normalized = normalizeApiError(error);
    if (normalized.status === 401 && getCsrfToken?.()) {
      handleUnauthorized?.();
    }
    return Promise.reject(normalized);
  },
);
