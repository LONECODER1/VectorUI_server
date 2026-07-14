export interface OpenRouterMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export type AskAIFn = (messages: OpenRouterMessage[]) => Promise<string>;
