import { Outlet } from "react-router-dom";
import { SiteNavbar } from "@/components/SiteNavbar";
import { Footer } from "@/components/Footer";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
