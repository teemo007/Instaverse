export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  id?: string;
}

export interface AuthSession {
  result: AuthUser;
  token: string;
}

export interface SignInValues {
  email: string;
  password: string;
}

export interface SignUpValues extends SignInValues {
  username: string;
  confirmPassword: string;
}
