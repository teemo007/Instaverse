import axios from "axios";

import type { AppError } from "./api.types";

const DEFAULT_ERROR_MESSAGE = "Something went wrong";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isAppError = (value: unknown): value is AppError =>
  !(value instanceof Error) &&
  isRecord(value) &&
  typeof value.message === "string" &&
  value.message.trim().length > 0 &&
  (value.status === undefined || typeof value.status === "number") &&
  (value.code === undefined || typeof value.code === "string");

const getResponseCode = (data: unknown): string | undefined =>
  isRecord(data) && typeof data.code === "string" && data.code.trim()
    ? data.code
    : undefined;

const getResponseMessage = (data: unknown): string | null => {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

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
    const code = getResponseCode(error.response?.data);

    return {
      message,
      ...(typeof status === "number" ? { status } : {}),
      ...(code ? { code } : {}),
    };
  }

  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error && error.message.trim()) {
    return { message: error.message };
  }

  if (typeof error === "string" && error.trim()) {
    return { message: error };
  }

  return { message: DEFAULT_ERROR_MESSAGE };
};
