import type { CSSProperties } from "react";

const styles = {
  cardContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    boxShadow: "rgba(0, 0, 0, 0.24) 0 3px 8px",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  heartFilled: {
    color: "magenta",
  },
} satisfies Record<string, CSSProperties>;

export default styles;
