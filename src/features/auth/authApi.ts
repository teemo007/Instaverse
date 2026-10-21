import { apiClient } from "../../api/client";

import type {
  AuthSession,
  SignInValues,
  SignUpValues,
} from "./auth.types";

export const restoreSessionRequest = async (): Promise<AuthSession> => {
  const { data } = await apiClient.get<AuthSession>("/user/session");
  return data;
};

export const signInRequest = async (
  values: SignInValues,
): Promise<AuthSession> => {
  const { data } = await apiClient.post<AuthSession>("/user/signin", values);
  return data;
};

export const signUpRequest = async (
  values: SignUpValues,
): Promise<AuthSession> => {
  const { data } = await apiClient.post<AuthSession>("/user/signup", values);
  return data;
};

export const signOutRequest = async (): Promise<void> => {
  await apiClient.post("/user/signout", {});
};
