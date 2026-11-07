import { configureStore } from "@reduxjs/toolkit";

import {
  registerCsrfTokenGetter,
  registerUnauthorizedHandler,
} from "../api/client";
import { authReducer, sessionExpired } from "../features/auth/authSlice";
import { commentsReducer } from "../features/comments/commentsSlice";
import { storiesReducer } from "../features/stories/storiesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stories: storiesReducer,
    comments: commentsReducer,
  },
});

registerCsrfTokenGetter(() => store.getState().auth.csrfToken);
registerUnauthorizedHandler(() => {
  store.dispatch(sessionExpired());
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
