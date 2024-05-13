import * as api from "../api";
import {
  ADD_COMMENT,
  FETCH_COMMENTS,
  ADD_REPLY,
  FETCH_REPLIES,
} from "../constants/actionType";

export const addComment = (storyId, comment) => async (dispatch) => {
  try {
    const { data } = await api.addComment(storyId, comment);
    const action = {
      type: ADD_COMMENT,
      payload: {
        storyId,
        comment: data, // The newly created comment
      },
    };
    dispatch(action);
  } catch (error) {
    console.log(error.message);
  }
};

export const fetchComments = (storyId) => async (dispatch) => {
  try {
    const { data } = await api.commentsforStory(storyId);
    const action = {
      type: FETCH_COMMENTS,
      payload: {
        storyId, // Pass the story ID to associate comments with the correct story
        comments: data, // Ensure this is the list of comments
      },
    };
    dispatch(action);
  } catch (error) {
    console.log(error.message);
  }
};

export const addReply =
  (storyId, commentParentId, replyData) => async (dispatch) => {
    try {
      const { data } = await api.addreplytoComment(
        storyId,
        commentParentId,
        replyData
      );
      const action = { type: ADD_REPLY, payload: {commentParentId,reply: data} };
      dispatch(action);
    } catch (error) {
      console.log(error.message);
    }
  };

export const fetchReplies = (commentId) => async (dispatch) => {
  try {
    const { data } = await api.repliesforComment(commentId);

    const action = { type: FETCH_REPLIES, payload: {commentId,replies: data} };
    dispatch(action);
  } catch (error) {
    console.log(error.message);
  }
};
