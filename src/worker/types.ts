export interface Env {
  AI: Ai;
  DB: D1Database;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  created_at: number;
  updated_at: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: number;
}

export interface ChatRequest {
  conversation_id: string;
  model: string;
  messages: { role: "user" | "assistant"; content: string }[];
  storage_mode: "cloud" | "local";
}
