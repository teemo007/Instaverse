export const GOOGLE_IDENTITY_SCRIPT_URL =
  "https://accounts.google.com/gsi/client";

export interface GoogleCredentialResponse {
  credential?: string;
}

export interface GoogleInitializeOptions {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

export interface GoogleButtonOptions {
  type: "standard";
  theme: "outline";
  size: "large";
  width?: number;
}

interface GoogleIdentityApi {
  initialize(options: GoogleInitializeOptions): void;
  renderButton(parent: HTMLElement, options: GoogleButtonOptions): void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdentityApi;
      };
    };
  }
}

const getGoogleIdentityApi = (): GoogleIdentityApi => {
  const api = window.google?.accounts.id;
  if (!api) {
    throw new Error("Google Sign-In could not be loaded.");
  }
  return api;
};

export const loadGoogleIdentityScript = async (): Promise<void> => {
  if (window.google?.accounts.id) {
    return;
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${GOOGLE_IDENTITY_SCRIPT_URL}"]`,
  );
  const script = existing ?? document.createElement("script");

  await new Promise<void>((resolve, reject) => {
    const onLoad = () => {
      cleanup();
      try {
        getGoogleIdentityApi();
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    const onError = () => {
      cleanup();
      script.remove();
      reject(new Error("Google Sign-In could not be loaded."));
    };
    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    if (!existing) {
      script.src = GOOGLE_IDENTITY_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.append(script);
    }
  });
};

export const initializeGoogleIdentity = (
  options: GoogleInitializeOptions,
): void => {
  getGoogleIdentityApi().initialize(options);
};

export const renderGoogleButton = (
  parent: HTMLElement,
  options: GoogleButtonOptions,
): void => {
  getGoogleIdentityApi().renderButton(parent, options);
};
