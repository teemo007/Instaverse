import { configureStore } from "@reduxjs/toolkit";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { authReducer } from "../authSlice";
import {
  linkGoogleRequest,
  signInWithGoogleRequest,
} from "../authApi";
import {
  GOOGLE_IDENTITY_SCRIPT_URL,
  loadGoogleIdentityScript,
} from "../googleIdentity";
import GoogleSignInButton from "./GoogleSignInButton";

vi.mock("../authApi", () => ({
  linkGoogleRequest: vi.fn(),
  restoreSessionRequest: vi.fn(),
  signInRequest: vi.fn(),
  signInWithGoogleRequest: vi.fn(),
  signOutRequest: vi.fn(),
  signUpRequest: vi.fn(),
}));

const session = {
  user: {
    _id: "user-1",
    username: "Kyle",
    email: "kyle@example.com",
  },
  csrfToken: "csrf-token",
};

type CredentialCallback = (response: { credential?: string }) => void;

const installGoogle = () => {
  let callback: CredentialCallback | undefined;
  const initialize = vi.fn((options: { callback: CredentialCallback }) => {
    callback = options.callback;
  });
  const renderButton = vi.fn();
  Object.defineProperty(window, "google", {
    configurable: true,
    value: { accounts: { id: { initialize, renderButton } } },
  });
  return { initialize, renderButton, callback: () => callback };
};

const renderButton = () => {
  const store = configureStore({ reducer: { auth: authReducer } });
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/auth"]}>
        <Routes>
          <Route path="/auth" element={<GoogleSignInButton />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return { store, ...result };
};

beforeEach(() => {
  vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "test-client-id");
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  document.querySelectorAll(`script[src="${GOOGLE_IDENTITY_SCRIPT_URL}"]`)
    .forEach((script) => script.remove());
  Reflect.deleteProperty(window, "google");
});

describe("loadGoogleIdentityScript", () => {
  it("loads only the official GIS script", async () => {
    const loading = loadGoogleIdentityScript();
    const script = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_IDENTITY_SCRIPT_URL}"]`,
    );
    expect(script).not.toBeNull();
    expect(script?.src).toBe(GOOGLE_IDENTITY_SCRIPT_URL);

    installGoogle();
    script?.dispatchEvent(new Event("load"));
    await expect(loading).resolves.toBeUndefined();
  });

  it("reports script loading failure and removes the failed element", async () => {
    const loading = loadGoogleIdentityScript();
    const script = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_IDENTITY_SCRIPT_URL}"]`,
    );
    script?.dispatchEvent(new Event("error"));

    await expect(loading).rejects.toThrow("Google Sign-In could not be loaded");
    expect(script).not.toBeInTheDocument();
  });
});

describe("GoogleSignInButton", () => {
  it("shows a safe configuration error when the client ID is absent", async () => {
    vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "");
    renderButton();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Google Sign-In is not configured.",
    );
  });

  it("renders the Google button and signs in from its credential callback", async () => {
    const google = installGoogle();
    vi.mocked(signInWithGoogleRequest).mockResolvedValue(session);
    renderButton();

    await waitFor(() => expect(google.renderButton).toHaveBeenCalledOnce());
    expect(google.initialize).toHaveBeenCalledWith(expect.objectContaining({
      client_id: "test-client-id",
    }));

    await act(async () => {
      google.callback()?.({ credential: "signed-google-credential" });
    });

    expect(signInWithGoogleRequest).toHaveBeenCalledWith("signed-google-credential");
    expect(await screen.findByText("Home")).toBeInTheDocument();
  });

  it("retains the credential only while password linking is required", async () => {
    const google = installGoogle();
    vi.mocked(signInWithGoogleRequest).mockRejectedValue({
      message: "Sign in with your existing password to link Google.",
      status: 409,
      code: "ACCOUNT_LINK_REQUIRED",
    });
    vi.mocked(linkGoogleRequest)
      .mockRejectedValueOnce({
        message: "Email or password is incorrect.",
        status: 401,
        code: "INVALID_CREDENTIALS",
      })
      .mockResolvedValueOnce(session);
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    const logSpy = vi.spyOn(console, "log");
    renderButton();
    await waitFor(() => expect(google.renderButton).toHaveBeenCalledOnce());

    await act(async () => {
      google.callback()?.({ credential: "short-lived-credential" });
    });
    const password = await screen.findByLabelText("Existing account password");
    fireEvent.change(password, { target: { value: "wrong-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Link Google" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Email or password is incorrect.",
    );
    expect(screen.getByLabelText("Existing account password")).toBeInTheDocument();

    fireEvent.change(password, { target: { value: "correct-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Link Google" }));
    expect(await screen.findByText("Home")).toBeInTheDocument();
    expect(linkGoogleRequest).toHaveBeenNthCalledWith(1, {
      credential: "short-lived-credential",
      password: "wrong-password",
    });
    expect(linkGoogleRequest).toHaveBeenNthCalledWith(2, {
      credential: "short-lived-credential",
      password: "correct-password",
    });
    expect(storageSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("ignores credential callbacks after unmount", async () => {
    const google = installGoogle();
    const rendered = renderButton();
    await waitFor(() => expect(google.renderButton).toHaveBeenCalledOnce());
    rendered.unmount();

    await act(async () => {
      google.callback()?.({ credential: "late-credential" });
    });
    expect(signInWithGoogleRequest).not.toHaveBeenCalled();
  });
});
