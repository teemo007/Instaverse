import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "src/components/reply/threading.test.js",
      "src/reducers/comments.test.js",
    ],
  },
});
