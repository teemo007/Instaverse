import axios from "axios";

import { loadStoredAuth } from "../features/auth/authPersistence";
import { normalizeApiError } from "./errors";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const session = loadStoredAuth();

  if (session) {
    config.headers.set("Authorization", `Bearer ${session.token}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);
