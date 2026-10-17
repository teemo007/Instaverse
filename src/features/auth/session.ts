import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp?: unknown;
}

export const isTokenExpired = (
  token: string,
  nowSeconds = Date.now() / 1000,
): boolean => {
  try {
    const { exp } = jwtDecode<TokenPayload>(token);

    if (exp === undefined) {
      return false;
    }

    return typeof exp !== "number" || exp < nowSeconds;
  } catch {
    return true;
  }
};
