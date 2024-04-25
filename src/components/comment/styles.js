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
        position: "absolute",
        bottom: 0,
        width: "98%",
        height: "70%",
        backgroundColor: "white",
        opacity: 1,
        zIndex: 10,
        borderRadius: "10px 10px 0px 0px",
      },
      exitComment: {
        position: "absolute",
        top: 5,
        right: 5,
        color: "black",
        cursor: "pointer",
        zIndex: 11,
      },
}

export default styles