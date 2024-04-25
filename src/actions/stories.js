import * as api from "../api";
import {
  FETCH_ALL_STORIES,
  CREATE_STORY,
  UPDATE_STORY,
  DELETE_STORY,
  LIKE_STORY,
} from "../constants/actionType";

export const getStories = () => async (dsipatch) => {
  try {
    const { data } = await api.fetchStories();
    const action = { type: FETCH_ALL_STORIES, payload: data };
    dsipatch(action);
  } catch (error) {
    console.log(error.message);
  }
};

export const createStory = (story) => async (dsipatch) => {
  try {
    const { data } = await api.CreateStory(story);
    const action = { type: CREATE_STORY, payload: data };
    dsipatch(action);
  } catch (error) {
    console.log(error.message);
  }
};

export const updateStory = (id, story) => async (dsipatch) => {
  try {
    const { data } = await api.updateStory(id, story);
    //console.log(data) // return updated post
    const action = { type: UPDATE_STORY, payload: data };
    dsipatch(action);
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteStory = (id) => async (dsipatch) => {
  try {
    await api.deleteStory(id);
    //console.log(data) // return updated post
    const action = { type: DELETE_STORY, payload: id };
    dsipatch(action);
  } catch (error) {
    console.log(error.message);
  }
};

export const likeStroy = (id) => async (dispatch) => {
  try {
    const { data } = await api.likeStroy(id);
    const action = { type: LIKE_STORY, payload: data };
    dispatch(action);
  } catch (error) {
    console.log(error.message);
  }
};
