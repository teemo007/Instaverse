import type { CSSProperties } from "react";

const styles = {
  formTitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formCard: {
    width: 390,
    position: "fixed",
    margin: "30px 10px",
  },
} satisfies Record<string, CSSProperties>;

export default styles;
