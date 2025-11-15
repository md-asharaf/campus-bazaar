import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/home";
import { Categories } from "./pages/categories";
import About from "./pages/about";
import NotFound from "./pages/not-found";
import { ChatContainer } from "./components/chat/container";
import { AuthProvider } from "./providers/auth-provider";
import ChatList from "./components/chat/list";
import QueryProvider from "./providers/query-provider";
import { Products } from "./pages/products";
import { MainLayout } from "./components/layout/layout";
import { PrivateLayout } from "./components/layout/private-layout";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import { ItemDetails } from "./pages/item";
import { CreateItem } from "./pages/create-item";
import { Wishlist } from "./pages/wishlist";
import { UserProfile } from "./pages/profile";
import { Verification } from "./pages/verification";
import { Toaster } from "./components/ui/sonner";
import { Login } from "./pages/login";
import StudentLoginPage from "./pages/student-login";
import AdminLoginPage from "./pages/admin-login";

import { AdminAuthProvider } from "./providers/admin-provider";
import { AdminOverview } from "./pages/admin/overview";
import { AdminUsersPage } from "./pages/admin/users";
import { AdminItemsPage } from "./pages/admin/items";
import { AdminVerificationsPage } from "./pages/admin/verifications";
import { AdminAnalyticsPage } from "./pages/admin/analytics";
import { AdminLayout } from "./pages/admin/layout";

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminAuthProvider>
            <Routes>
              {/* Main public layout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/items" element={<Products />} />
                <Route path="/items/:itemId" element={<ItemDetails />} />
                <Route path="/sell" element={<CreateItem />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:userId" element={<UserProfile />} />
                <Route path="/verify" element={<Verification />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Private user layout */}
              <Route element={<PrivateLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/messages" element={<ChatList />} />
                <Route path="/chat/:chatId" element={<ChatContainer />} />
              </Route>

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/student-login" element={<StudentLoginPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="items" element={<AdminItemsPage />} />
                <Route path="verifications" element={<AdminVerificationsPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Routes>
          </AdminAuthProvider>
        </AuthProvider>
      </BrowserRouter>

      <Toaster richColors />
    </QueryProvider>
  );
}
