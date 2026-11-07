import type { CSSProperties } from "react";

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    margin: "6rem",
  },
  alert: {
    width: "400px",
    marginBottom: "0.5rem",
  },
  card: {
    width: "400px",
  },
  title: {
    textAlign: "center",
  },
  divider: {
    margin: "8px 0 16px",
  },
  googleButton: {
    display: "flex",
    justifyContent: "center",
  },
} satisfies Record<string, CSSProperties>;

export default styles;
