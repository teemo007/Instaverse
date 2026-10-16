import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "../features/auth/authSlice";
import { commentsReducer } from "../features/comments/commentsSlice";
import { storiesReducer } from "../features/stories/storiesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stories: storiesReducer,
    comments: commentsReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
