export type AIProvider = "openai" | "claude" | "custom";

export interface APIConfig {
  provider: AIProvider;
  apiKey: string;
  endpoint?: string;
  model: string;
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const defaultModels: Record<AIProvider, string[]> = {
  openai: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
  claude: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
  custom: ["custom-model"],
};

export const defaultEndpoints: Record<AIProvider, string> = {
  openai: "https://api.openai.com/v1/chat/completions",
  claude: "https://api.anthropic.com/v1/messages",
  custom: "",
};

export const defaultAPIConfig: APIConfig = {
  provider: "openai",
  apiKey: "",
  endpoint: defaultEndpoints.openai,
  model: "gpt-4",
};
