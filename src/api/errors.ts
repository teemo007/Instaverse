import axios from "axios";

import type { AppError } from "./api.types";

const DEFAULT_ERROR_MESSAGE = "Something went wrong";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getResponseMessage = (data: unknown): string | null => {
  if (!isRecord(data)) {
    return null;
  }

  if (typeof data.msg === "string" && data.msg.trim()) {
    return data.msg;
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  return null;
};

export const normalizeApiError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    const message =
      getResponseMessage(error.response?.data) ||
      (error.message.trim() ? error.message : DEFAULT_ERROR_MESSAGE);
    const status = error.response?.status;

    return typeof status === "number" ? { message, status } : { message };
  }

  if (error instanceof Error && error.message.trim()) {
    return { message: error.message };
  }

  if (typeof error === "string" && error.trim()) {
    return { message: error };
  }

  return { message: DEFAULT_ERROR_MESSAGE };
};
