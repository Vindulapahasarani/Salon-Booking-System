'use client';

import { usePathname } from "next/navigation";
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import Footer from "@/components/Home/Footer/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!isAuthPage && <ResponsiveNav />}
      <main className={`${!isAuthPage ? "pt-16" : ""} min-h-screen`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}
