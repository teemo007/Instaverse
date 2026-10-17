import { describe, expect, it } from "vitest";

describe("ErrorBoundary", () => {
  it("switches to its fallback state after a render error", async () => {
    const { ErrorBoundary } = await import("./ErrorBoundary");

    expect(ErrorBoundary.getDerivedStateFromError()).toEqual({
      hasError: true,
    });
  });
});
