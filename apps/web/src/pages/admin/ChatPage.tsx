import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { api } from "@/lib/api";
import { useWebSocket } from "@/hooks/use-web-socket";
import { cn } from "@/lib/cn";

interface Conversation {
  _id: string;
  clientEmail: string;
  clientName: string;
  status: "active" | "closed";
  lastMessageAt: string;
}

interface Message {
  _id: string;
  sender: "client" | "admin";
  text: string;
  imageUrl?: string;
  timestamp: string;
}

export function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isConnected, connect, send } = useWebSocket("/ws/chat", {
    onMessage: (data) => {
      if (
        data.type === "message" &&
        selectedConversation &&
        data.payload.conversationId === selectedConversation._id
      ) {
        setMessages((prev) => [...prev, data.payload]);
      }
    },
  });

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get<{ conversations: Conversation[] }>("/conversations");
        setConversations(response.conversations);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
    connect();
  }, [connect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);

    try {
      const response = await api.get<{ messages: Message[] }>(`/conversations/${conversation._id}`);
      setMessages(response.messages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    send({
      type: "message",
      payload: {
        conversationId: selectedConversation._id,
        text: newMessage,
        sender: "admin",
      },
    });

    setNewMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-3xl font-bold text-gradient">Chat</h1>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      <div className="flex w-80 flex-col border-r border-border">
        <h2 className="border-b border-border p-4 text-xl font-semibold">Conversations</h2>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-center text-muted">No conversations yet</p>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation._id}
                type="button"
                onClick={() => handleSelectConversation(conversation)}
                className={cn(
                  "w-full border-b border-border p-4 text-left transition-colors hover:bg-surface",
                  selectedConversation?._id === conversation._id && "bg-surface",
                )}
              >
                <p className="font-semibold">{conversation.clientName || "Anonymous"}</p>
                <p className="text-sm text-muted">{conversation.clientEmail}</p>
                <p className="mt-1 text-xs text-muted">
                  {new Date(conversation.lastMessageAt).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            <div className="border-b border-border p-4">
              <h3 className="font-semibold">{selectedConversation.clientName || "Anonymous"}</h3>
              <p className="text-sm text-muted">{selectedConversation.clientEmail}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={cn(
                      "flex",
                      message.sender === "admin" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2",
                        message.sender === "admin"
                          ? "bg-cardinal text-foreground"
                          : "bg-surface text-foreground",
                      )}
                    >
                      <p>{message.text}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-cardinal focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-lg bg-cardinal px-4 py-3 text-foreground transition-colors hover:bg-cardinal-light disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
