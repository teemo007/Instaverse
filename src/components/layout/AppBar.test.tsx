// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { message } from "antd";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { authReducer } from "../../features/auth/authSlice";
import { signOutRequest } from "../../features/auth/authApi";
import { ComposerContext } from "../../features/stories/composer/composerContext";
import AppBar from "./AppBar";

vi.mock("../../features/auth/authApi", () => ({
  linkGoogleRequest: vi.fn(),
  restoreSessionRequest: vi.fn(),
  signInRequest: vi.fn(),
  signInWithGoogleRequest: vi.fn(),
  signOutRequest: vi.fn(),
  signUpRequest: vi.fn(),
}));

beforeAll(() => {
  // Ant Design's responsive components query matchMedia, which jsdom lacks.
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

const renderSignedIn = () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: { _id: "user-1", username: "Kyle", email: "kyle@example.com" },
        csrfToken: "csrf-token",
        status: "succeeded" as const,
        initialized: true,
        error: null,
      },
    },
  });
  render(
    <Provider store={store}>
      <ComposerContext.Provider value={{ openCreate: vi.fn(), openEdit: vi.fn() }}>
        <MemoryRouter initialEntries={["/profile"]}>
          <AppBar />
          <Routes>
            <Route path="/" element={<div>Home page</div>} />
            <Route path="/profile" element={<div>Profile page</div>} />
          </Routes>
        </MemoryRouter>
      </ComposerContext.Provider>
    </Provider>,
  );
  return store;
};

const clickLogOut = () =>
  fireEvent.click(screen.getByText("Log out").closest("button")!);

describe("AppBar sign out", () => {
  it("navigates home after a successful sign out", async () => {
    vi.mocked(signOutRequest).mockResolvedValue();
    const errorToast = vi.spyOn(message, "error");
    const store = renderSignedIn();

    clickLogOut();

    expect(await screen.findByText("Home page")).toBeInTheDocument();
    expect(store.getState().auth.user).toBeNull();
    expect(errorToast).not.toHaveBeenCalled();
  });

  it("shows an error and stays signed in when sign out fails", async () => {
    vi.mocked(signOutRequest).mockRejectedValue({
      message: "Request verification failed.",
      status: 403,
    });
    const errorToast = vi.spyOn(message, "error");
    const store = renderSignedIn();

    clickLogOut();

    await waitFor(() =>
      expect(errorToast).toHaveBeenCalledWith("Unable to log out. Please try again."),
    );
    expect(screen.getByText("Profile page")).toBeInTheDocument();
    expect(store.getState().auth.user).not.toBeNull();
  });

  it("treats an already-expired session as signed out without an error", async () => {
    vi.mocked(signOutRequest).mockRejectedValue({
      message: "Sign in required.",
      status: 401,
    });
    const errorToast = vi.spyOn(message, "error");
    renderSignedIn();

    clickLogOut();

    expect(await screen.findByText("Home page")).toBeInTheDocument();
    expect(errorToast).not.toHaveBeenCalled();
  });
});
