import { createContext, useContext } from "react";

export type SchemePreference = "light" | "dark" | "system";
export type ResolvedScheme = "light" | "dark";

export const STORAGE_KEY = "kapsule:color-scheme";

export interface ColorSchemeContextValue {
  preference: SchemePreference;
  resolved: ResolvedScheme;
  setPreference: (preference: SchemePreference) => void;
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  preference: "system",
  resolved: "light",
  setPreference: () => undefined,
});

export const useColorScheme = (): ColorSchemeContextValue =>
  useContext(ColorSchemeContext);

export const readPreference = (): SchemePreference => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
};

export const writePreference = (preference: SchemePreference): void => {
  try {
    if (preference === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, preference);
    }
  } catch {
    // Storage can be unavailable (private mode, blocked site data).
  }
};

export const systemPrefersDark = (): boolean =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
