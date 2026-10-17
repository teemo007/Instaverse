import type { CSSProperties } from "react";

const styles = {
  layout: { minHeight: "100vh" },
  footer: {
    color: "white",
    textAlign: "center",
    background: "linear-gradient(to right, #4da0b0, #d39d38)",
  },
} satisfies Record<string, CSSProperties>;

export default styles;
