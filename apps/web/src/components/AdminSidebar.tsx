import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, MessageSquare, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { api } from "@/lib/api";

const ADMIN_LINKS = [
  { href: "/admin/home", icon: Home, label: "Home" },
  { href: "/admin/schedule", icon: Calendar, label: "Turnos" },
  { href: "/admin/chat", icon: MessageSquare, label: "Chat" },
  { href: "/admin/payments", icon: CreditCard, label: "Pagos" },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    navigate("/admin/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-background p-4">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold text-gradient">Kirbill Admin</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {ADMIN_LINKS.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
                isActive
                  ? "bg-cardinal text-foreground"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
      >
        <LogOut size={20} />
        Cerrar sesión
      </button>
    </aside>
  );
}
