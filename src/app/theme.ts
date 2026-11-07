import { theme as antdTheme, type ThemeConfig } from "antd";

import type { ResolvedScheme } from "./colorScheme";

const shared: ThemeConfig = {
  token: {
    colorError: "#ff4d6d",
    borderRadius: 10,
    controlHeight: 38,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: 14,
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: "none",
      defaultShadow: "none",
    },
    Input: {
      activeShadow: "none",
    },
  },
};

const light: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    ...shared.token,
    colorPrimary: "#7b61ff",
    colorLink: "#5b3fe0",
    colorText: "#12111f",
    colorTextSecondary: "#6e6b85",
    colorBorder: "#e1dff0",
    colorBgLayout: "#f6f6fb",
  },
  components: {
    ...shared.components,
    Modal: { borderRadiusLG: 20 },
  },
};

const dark: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    ...shared.token,
    colorPrimary: "#8c75ff",
    colorLink: "#7cf7ff",
    colorText: "#f2f2ff",
    colorTextSecondary: "#a6a4c4",
    colorBorder: "#2c2b45",
    colorBgLayout: "#0a0a14",
    colorBgContainer: "#141425",
    colorBgElevated: "#1f1e33",
  },
  components: {
    ...shared.components,
    Modal: { borderRadiusLG: 20, contentBg: "#141425", headerBg: "#141425" },
  },
};

export const getTheme = (scheme: ResolvedScheme): ThemeConfig =>
  scheme === "dark" ? dark : light;
