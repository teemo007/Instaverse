import {
  ADD_COMMENT,
  FETCH_COMMENTS,
  ADD_REPLY,
  FETCH_REPLIES,
} from "../constants/actionType";

const initialState = {
  comments: [],
  replies: {},
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COMMENT:
      const { storyId: story, comment } = action.payload;
      const existingComments = state.comments[story] || [];

      return {
        ...state,
        comments: {
          ...state.comments,
          [story]: [...existingComments, comment], // Append the new comment
        },
      };
    case FETCH_COMMENTS:
      const { storyId, comments } = action.payload;
      return {
        ...state,
        comments: {
          ...state.comments,
          [storyId]: comments, // Store comments by story ID
        },
      };
    case ADD_REPLY:
      const { commentParentId, reply } = action.payload;
      //console.log("commentParentId",commentParentId)
      //console.log("ADDED REPLY",state.replies)
      const existingReplies = state.replies[commentParentId] || [];
      
      return {
        ...state,
        replies: {
          ...state.replies,
          [commentParentId]: [...existingReplies, reply]
        }
      };
    case FETCH_REPLIES:
      //console.log("FETCH_REPLIES",action.playload.commentId)
      const {commentId , replies} = action.payload
      return {
        ...state,
        /* comments: state.comments.map((comment) =>
          comment._id === action.payload.parentId
            ? { ...comment, replies: action.payload.replies }
            : comment
        ), */
        replies: {
          ...state.replies,
          [commentId] : replies
        }
      };

    default:
      return state;
  }
};

export default commentsReducer;
