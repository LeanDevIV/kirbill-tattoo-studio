import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { useWebSocket } from "@/hooks/use-web-socket";
import { api } from "@/lib/api";

interface Message {
  _id: string;
  sender: "client" | "admin";
  text: string;
  imageUrl?: string;
  timestamp: string;
}

interface ChatPanelProps {
  onClose: () => void;
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [step, setStep] = useState<"intro" | "chat">("intro");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isConnected, connect, send } = useWebSocket("/ws/chat", {
    onMessage: (data) => {
      if (data.type === "init") {
        setConversationId(data.payload.conversationId);
        setStep("chat");
      }

      if (data.type === "message") {
        setMessages((prev) => [...prev, data.payload]);
      }
    },
  });

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = async () => {
    if (!email || !name) return;

    send({
      type: "init",
      payload: { email, name },
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return;

    send({
      type: "message",
      payload: {
        conversationId,
        text: newMessage,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="glass flex h-[600px] w-full max-w-2xl flex-col rounded-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-xl font-bold text-gradient">Chat</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {step === "intro" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            <h4 className="text-2xl font-semibold">Welcome!</h4>
            <p className="text-center text-muted">
              Please enter your details to start a conversation
            </p>
            <div className="w-full max-w-sm space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-cardinal focus:outline-none"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-cardinal focus:outline-none"
              />
              <button
                type="button"
                onClick={handleStartChat}
                disabled={!email || !name}
                className="w-full rounded-lg bg-cardinal px-4 py-3 font-semibold text-foreground transition-colors hover:bg-cardinal-light disabled:opacity-50"
              >
                Start Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === "client"
                          ? "bg-cardinal text-foreground"
                          : "bg-surface text-foreground"
                      }`}
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
        )}
      </div>
    </div>
  );
}
