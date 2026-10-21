import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { AppError, AsyncStatus } from "../../api/api.types";
import { normalizeApiError } from "../../api/errors";
import {
  restoreSessionRequest,
  signInRequest,
  signOutRequest,
  signUpRequest,
} from "./authApi";
import type {
  AuthSession,
  AuthUser,
  SignInValues,
  SignUpValues,
} from "./auth.types";

export interface AuthState {
  user: AuthUser | null;
  csrfToken: string | null;
  status: AsyncStatus;
  initialized: boolean;
  error: AppError | null;
}

export const createInitialAuthState = (): AuthState => ({
  user: null,
  csrfToken: null,
  status: "idle",
  initialized: false,
  error: null,
});

type AuthThunkConfig = {
  rejectValue: AppError;
  state: { auth: AuthState };
};

export const restoreSession = createAsyncThunk<
  AuthSession,
  void,
  AuthThunkConfig
>(
  "auth/restoreSession",
  async (_unused, { rejectWithValue }) => {
    try {
      return await restoreSessionRequest();
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
  {
    condition: (_unused, { getState }) => {
      const { initialized, status } = getState().auth;
      return !initialized && status !== "loading";
    },
  },
);

export const signIn = createAsyncThunk<
  AuthSession,
  SignInValues,
  AuthThunkConfig
>("auth/signIn", async (values, { rejectWithValue }) => {
  try {
    return await signInRequest(values);
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const signUp = createAsyncThunk<
  AuthSession,
  SignUpValues,
  AuthThunkConfig
>("auth/signUp", async (values, { rejectWithValue }) => {
  try {
    return await signUpRequest(values);
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const signOut = createAsyncThunk<void, void, AuthThunkConfig>(
  "auth/signOut",
  async (_unused, { rejectWithValue }) => {
    try {
      await signOutRequest();
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

const applySession = (
  state: AuthState,
  action: PayloadAction<AuthSession>,
): void => {
  const session = action.payload;
  state.user = session.user;
  state.csrfToken = session.csrfToken;
  state.status = "succeeded";
  state.initialized = true;
  state.error = null;
};

const clearSession = (state: AuthState): void => {
  state.user = null;
  state.csrfToken = null;
  state.status = "idle";
  state.initialized = true;
  state.error = null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: createInitialAuthState(),
  reducers: {
    sessionExpired: clearSession,
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
        state.initialized = false;
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, applySession)
      .addCase(restoreSession.rejected, (state, action) => {
        const error = action.payload ?? normalizeApiError(action.error);
        if (error.status === 401) {
          clearSession(state);
          return;
        }
        state.status = "failed";
        state.initialized = false;
        state.error = error;
      })
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, applySession)
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      })
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, applySession)
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      })
      .addCase(signOut.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signOut.fulfilled, clearSession)
      .addCase(signOut.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export const authReducer = authSlice.reducer;
