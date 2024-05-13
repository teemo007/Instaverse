const styles = {
  commentOverlay: {
    background: "rgba(49,49,49,0.8)",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
  },

  commentContent: {
    position: "relative",
    bottom: 0,
    width: "98%",
    height: "100%",
    backgroundColor: "white",
    opacity: 1,
    zIndex: 10,
    borderRadius: "10px 10px 0px 0px",
    overflow: "hidden",
  },
  exitComment: {
    position: "sticky",
    top: 5,
    right: 5,
    color: "black",
    cursor: "pointer",
    zIndex: 11,
    float: "right",
  },
  headerComment: {
    textAlign: "center",
    position: "sticky",
    top: 0,
    zIndex: 2,
    padding: "0.5rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
  },
  footerComment: {
    position: "sticky",
    bottom: 0,
    height: "4.5rem",
    zIndex: 2,
    padding: "0.5rem",
    backgroundColor: "#fff",
    borderTop: "1px solid #ddd",
  },
/*   replyStyle: {
    fontSize: "small",
    color: "#717378",
  }, */
  replyWrapper: {
    display: "block",
    marginTop: 5,
    marginBottom: -10,
    fontSize: "small",
    color: "#808080",
  },
  divider: {
    color: "#DCDCDC",
  },
};

export default styles;
