import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Categories } from "./pages/Categories";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { ChatContainer } from "./components/chat/ChatContainer";
import { AuthProvider } from "./providers/AuthProvider";
import ChatList from "./components/chat/ChatList";
import QueryProvider from "./providers/QueryProvider";
import { Products } from "./pages/Products";
import { MainLayout } from "./components/layout/MainLayout";
import { PrivateLayout } from "./components/layout/PrivateLayout";
import { Register } from "./pages/Register";
import { AdminAuthProvider } from "./providers/AdminAuthProvider";
import { Dashboard } from "./pages/Dashboard";
import { ItemDetails } from "./pages/ItemDetails";
import { CreateItem } from "./pages/CreateItem";
import { Wishlist } from "./pages/Wishlist";
import { UserProfile } from "./pages/UserProfile";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Verification } from "./pages/Verification";
import { Toaster } from "./components/ui/sonner";
import { Login } from "./pages/Login";


export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Regular routes with flexible header and footer */}
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
            <Route>
              <Route path="/admin" element={
                <AdminAuthProvider>
                  <AdminDashboard />
                </AdminAuthProvider>
              } />
              <Route path="/login" element={
                <AdminAuthProvider>
                  <Login />
                </AdminAuthProvider>
              } />
            </Route>

            <Route element={<PrivateLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/messages" element={<ChatList />} />
              <Route path="/chat/:chatId" element={<ChatContainer />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster richColors />
      </AuthProvider>
    </QueryProvider >
  );
}