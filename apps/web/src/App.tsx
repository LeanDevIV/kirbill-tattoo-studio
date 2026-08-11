import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminGuard } from "@/components/AdminGuard";
import { HomePage } from "@/pages/public/HomePage";
import { LoginPage } from "@/pages/admin/LoginPage";
import { HomeAdminPage } from "@/pages/admin/HomeAdminPage";
import { SchedulePage } from "@/pages/admin/SchedulePage";
import { ChatPage } from "@/pages/admin/ChatPage";
import { PaymentsPage } from "@/pages/admin/PaymentsPage";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />

          <Route path="/admin" element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/home" replace />} />
              <Route path="home" element={<HomeAdminPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="payments" element={<PaymentsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
