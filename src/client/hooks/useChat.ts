import { useState, useCallback, useMemo } from "react";
import type {
  Conversation,
  Message,
  StorageAdapter,
  StorageMode,
} from "../storage";
import { createStorage } from "../storage";

interface UseChatReturn {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  newConversation: (model: string) => Promise<Conversation>;
  deleteConversation: (id: string) => Promise<void>;
  sendMessage: (
    content: string,
    model: string,
    conversationId: string,
    storageMode: StorageMode,
  ) => Promise<void>;
}

export function useChat(storageMode: StorageMode): UseChatReturn {
  const storage = useMemo(() => createStorage(storageMode), [storageMode]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await storage.getConversations();
      setConversations(data);
    } catch (e) {
      setError("Failed to load conversations");
    }
  }, [storage]);

  const selectConversation = useCallback(
    async (id: string) => {
      try {
        const data = await storage.getConversation(id);
        if (!data) return;
        setActiveConversation(data.conversation);
        setMessages(data.messages);
      } catch (e) {
        setError("Failed to load conversation");
      }
    },
    [storage],
  );

  const newConversation = useCallback(
    async (model: string): Promise<Conversation> => {
      const conversation = await storage.createConversation(model);
      setConversations((prev) => [conversation, ...prev]);
      setActiveConversation(conversation);
      setMessages([]);
      return conversation;
    },
    [storage],
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      await storage.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversation?.id === id) {
        setActiveConversation(null);
        setMessages([]);
      }
    },
    [storage, activeConversation],
  );

  const sendMessage = useCallback(
    async (content: string, model: string) => {
      if (!activeConversation || isStreaming) return;
      setError(null);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: activeConversation.id,
        role: "user",
        content,
        created_at: Date.now(),
      };

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: activeConversation.id,
        role: "assistant",
        content: "",
        created_at: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);

      try {
        const allMessages = [...messages, userMessage].map(
          ({ role, content }) => ({ role, content }),
        );

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: activeConversation.id,
            model,
            messages: allMessages,
          }),
        });

        if (!res.ok || !res.body) {
          console.error("[sendMessage] bad response", res.status);
          throw new Error("Chat request failed");
        }
        console.log("[sendMessage] streaming started");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep the last (potentially incomplete) line in the buffer
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            if (trimmed === "data: [DONE]") continue;
            try {
              const json = JSON.parse(trimmed.slice(6));
              if (json.response) {
                fullContent += json.response;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: fullContent }
                      : m,
                  ),
                );
              }
            } catch {}
          }
        }

        // For local storage mode, save messages manually
        await storage.saveMessage({
          conversation_id: activeConversation.id,
          role: "user",
          content,
        });
        await storage.saveMessage({
          conversation_id: activeConversation.id,
          role: "assistant",
          content: fullContent,
        });

        // Update title after first message in local mode
        if (messages.length === 0) {
          const title = fullContent.split(" ").slice(0, 5).join(" ");
          await storage.updateConversationTitle(activeConversation.id, title);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversation.id ? { ...c, title } : c,
            ),
          );
        }
      } catch (e) {
        console.error("[sendMessage] error:", e);
        setError("Failed to send message");
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
      } finally {
        setIsStreaming(false);
      }
    },
    [activeConversation, isStreaming, messages, storage],
  );

  return {
    conversations,
    activeConversation,
    messages,
    isStreaming,
    error,
    loadConversations,
    selectConversation,
    newConversation,
    deleteConversation,
    sendMessage,
  };
}
