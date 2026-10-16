import type { CSSProperties } from "react";

const styles = {
  thread: {
    marginTop: 2,
  },
  toggleButton: {
    height: 28,
    marginTop: 2,
    padding: 0,
    color: "#6b6c72",
    fontSize: 12,
    fontWeight: 600,
  },
  toggleIcon: {
    color: "#a0a1a6",
    fontSize: 10,
    transition: "transform 160ms ease",
  },
  replyList: {
    marginTop: 4,
    marginLeft: 3,
    paddingLeft: 14,
    borderLeft: "1px solid #ededf0",
  },
  replyItem: {
    padding: "9px 0",
    alignItems: "flex-start",
  },
  replyRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    width: "100%",
  },
  avatar: {
    flexShrink: 0,
    backgroundColor: "#d7d8dc",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
  },
  replyBody: {
    flex: 1,
    minWidth: 0,
  },
  username: {
    color: "#85868b",
    fontSize: 12,
    lineHeight: "18px",
  },
  usernameRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 2,
  },
  replyTarget: {
    color: "#a0a1a6",
    fontSize: 12,
    lineHeight: "18px",
  },
  replyText: {
    margin: 0,
    color: "#161823",
    fontSize: 14,
    lineHeight: 1.45,
    overflowWrap: "anywhere",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minHeight: 24,
    marginTop: 2,
  },
  timestamp: {
    color: "#a0a1a6",
    fontSize: 11,
  },
  actionButton: {
    height: 24,
    padding: 0,
    color: "#57585d",
    fontSize: 11,
    fontWeight: 600,
  },
} satisfies Record<string, CSSProperties>;

export default styles;
