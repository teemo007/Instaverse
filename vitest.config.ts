import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      ["src/features/auth/components/GoogleSignInButton.test.tsx", "jsdom"],
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
    ],
    setupFiles: ["./src/test/setup.ts"],
  },
});
