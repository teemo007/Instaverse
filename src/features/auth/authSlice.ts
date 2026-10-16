import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { AppError, AsyncStatus } from "../../api/api.types";
import { normalizeApiError } from "../../api/errors";
import { signInRequest, signUpRequest } from "./authApi";
import { loadStoredAuth, saveStoredAuth } from "./authPersistence";
import type {
  AuthSession,
  AuthUser,
  SignInValues,
  SignUpValues,
} from "./auth.types";

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: AsyncStatus;
  error: AppError | null;
}

export const createInitialAuthState = (
  storage?: Pick<Storage, "getItem">,
): AuthState => {
  const session = loadStoredAuth(storage);

  return {
    user: session?.result ?? null,
    token: session?.token ?? null,
    status: "idle",
    error: null,
  };
};

export const signIn = createAsyncThunk<
  AuthSession,
  SignInValues,
  { rejectValue: AppError }
>("auth/signIn", async (values, { rejectWithValue }) => {
  try {
    const session = await signInRequest(values);
    saveStoredAuth(session);
    return session;
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const signUp = createAsyncThunk<
  AuthSession,
  SignUpValues,
  { rejectValue: AppError }
>("auth/signUp", async (values, { rejectWithValue }) => {
  try {
    const session = await signUpRequest(values);
    saveStoredAuth(session);
    return session;
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: createInitialAuthState(),
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload.result;
        state.token = action.payload.token;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      })
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload.result;
        state.token = action.payload.token;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? normalizeApiError(action.error);
      });
  },
});

export const { signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
