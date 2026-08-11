import { Instagram, Facebook, MessageCircle } from "lucide-react";

const SOCIAL_LINKS = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://wa.me", icon: MessageCircle, label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4">
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-fuscia"
              aria-label={social.label}
            >
              <social.icon size={24} />
            </a>
          ))}
        </div>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Kirbill Tattoo Studio. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
