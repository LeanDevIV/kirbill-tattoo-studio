import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "#hero", label: "Inicio" },
  { href: "#gallery", label: "Galería" },
  { href: "#contact", label: "Contacto" },
];

export function SiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300",
        isScrolled ? "glass glow-cardinal rounded-full px-6 py-3" : "px-4 py-2",
      )}
    >
      <ul className="flex items-center gap-6">
        <li>
          <Link to="/" className="text-xl font-bold text-gradient">
            Kirbill
          </Link>
        </li>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
