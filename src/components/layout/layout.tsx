import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Outlet, useLocation } from "react-router-dom";

export const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${!isHomePage ? 'pt-0' : ''}`}>
        <div className="min-h-full w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};