import { combineReducers } from "redux";
import stories from "./stories";
import authenticationReducer from "./authentication";
import storyformReduecer from "./isLogin";
import commentsReducer from "./comments";

export default combineReducers({
  stories: stories,
  authenticationReducer: authenticationReducer,
  storyformReduecer: storyformReduecer,
  commentsReducer:commentsReducer,
});
