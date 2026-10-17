export interface AuthFormFields {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthRouteState {
  mode?: "signIn" | "signUp";
}
