import { beforeEach, describe, expect, it } from "vitest";

let useOpenAiSettings: typeof import("../use-openai-settings").useOpenAiSettings;

describe("useOpenAiSettings", () => {
  beforeEach(async () => {
    const settingsModule = await import("../use-openai-settings");
    useOpenAiSettings = settingsModule.useOpenAiSettings;
    useOpenAiSettings.persist?.clearStorage?.();
    useOpenAiSettings.setState({
      apiKey: null,
      apiKeyStatus: "unknown",
      lastCheckedAt: null,
    });
  });

  it("stores and clears the api key while tracking status transitions", () => {
    const { setApiKey, clearApiKey, markApiKeyStatus } = useOpenAiSettings.getState();

    expect(useOpenAiSettings.getState().apiKey).toBeNull();
    expect(useOpenAiSettings.getState().apiKeyStatus).toBe("unknown");

    setApiKey("sk-test-123");
    let state = useOpenAiSettings.getState();
    expect(state.apiKey).toBe("sk-test-123");
    expect(state.apiKeyStatus).toBe("unknown");
    expect(state.lastCheckedAt).toBeTruthy();

    markApiKeyStatus("valid");
    state = useOpenAiSettings.getState();
    expect(state.apiKeyStatus).toBe("valid");

    clearApiKey();
    state = useOpenAiSettings.getState();
    expect(state.apiKey).toBeNull();
    expect(state.apiKeyStatus).toBe("unknown");
  });
});
