import { apiClient } from "../../api/client";

import type {
  AuthSession,
  AuthUser,
  SignInValues,
  SignUpValues,
} from "./auth.types";

interface AuthApiUser extends AuthUser {
  password?: string;
}

interface AuthApiSession {
  result: AuthApiUser;
  token: string;
}

const toAuthSession = ({ result, token }: AuthApiSession): AuthSession => {
  const user: AuthUser = {
    _id: result._id,
    username: result.username,
    email: result.email,
  };

  if (result.id !== undefined) {
    user.id = result.id;
  }

  return { result: user, token };
};

export const signInRequest = async (
  values: SignInValues,
): Promise<AuthSession> => {
  const { data } = await apiClient.post<AuthApiSession>(
    "/user/signin",
    values,
  );
  return toAuthSession(data);
};

export const signUpRequest = async (
  values: SignUpValues,
): Promise<AuthSession> => {
  const { data } = await apiClient.post<AuthApiSession>(
    "/user/signup",
    values,
  );
  return toAuthSession(data);
};
