import type { AuthSession, AuthUser } from "./auth.types";

const PROFILE_KEY = "profile";

type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem">;
type StorageRemover = Pick<Storage, "removeItem">;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isAuthUser = (value: unknown): value is AuthUser => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value._id === "string" &&
    typeof value.username === "string" &&
    typeof value.email === "string" &&
    (value.id === undefined || typeof value.id === "string")
  );
};

const isAuthSession = (value: unknown): value is AuthSession =>
  isRecord(value) &&
  isAuthUser(value.result) &&
  typeof value.token === "string" &&
  value.token.length > 0;

const getBrowserStorage = (): Storage | undefined =>
  typeof localStorage === "undefined" ? undefined : localStorage;

export const loadStoredAuth = (
  storage: StorageReader | undefined = getBrowserStorage(),
): AuthSession | null => {
  if (!storage) {
    return null;
  }

  const storedProfile = storage.getItem(PROFILE_KEY);
  if (!storedProfile) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(storedProfile);
    return isAuthSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveStoredAuth = (
  session: AuthSession,
  storage: StorageWriter | undefined = getBrowserStorage(),
): void => {
  storage?.setItem(PROFILE_KEY, JSON.stringify(session));
};

export const clearStoredAuth = (
  storage: StorageRemover | undefined = getBrowserStorage(),
): void => {
  storage?.removeItem(PROFILE_KEY);
};
