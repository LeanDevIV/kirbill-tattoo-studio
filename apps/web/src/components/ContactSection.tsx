import { useState } from "react";
import { MessageCircle, Instagram, Facebook } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";

const SOCIAL_LINKS = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me" },
];

export function ContactSection() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <section id="contact" className="min-h-screen border-t border-border">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-4">
        <div className="flex flex-col items-center justify-center border-r border-border p-8 md:col-span-1">
          <h2 className="mb-8 text-3xl font-bold text-gradient">Contact</h2>
          <div className="flex flex-col gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted transition-colors hover:text-fuscia"
              >
                <social.icon size={24} />
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-8 md:col-span-3">
          <button
            type="button"
            onClick={handleOpenChat}
            className="glass rounded-full px-8 py-4 text-lg font-semibold transition-all hover:glow-cardinal"
          >
            Start a conversation
          </button>
        </div>
      </div>

      {isChatOpen && <ChatPanel onClose={handleCloseChat} />}
    </section>
  );
}
