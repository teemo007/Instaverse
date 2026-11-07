import { ConfigProvider } from "antd";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  ColorSchemeContext,
  readPreference,
  systemPrefersDark,
  writePreference,
  type SchemePreference,
} from "./colorScheme";
import { getTheme } from "./theme";

const THEME_COLORS = { light: "#ffffff", dark: "#0a0a14" } as const;

const ColorSchemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<SchemePreference>(readPreference);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolved = preference === "system" ? (systemDark ? "dark" : "light") : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[resolved]);
  }, [resolved]);

  const value = useMemo(
    () => ({
      preference,
      resolved,
      setPreference: (next: SchemePreference) => {
        writePreference(next);
        setPreferenceState(next);
      },
    }),
    [preference, resolved],
  );

  return (
    <ColorSchemeContext.Provider value={value}>
      <ConfigProvider theme={getTheme(resolved)}>{children}</ConfigProvider>
    </ColorSchemeContext.Provider>
  );
};

export default ColorSchemeProvider;
