import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import LayoutWrapper from "@/components/LayoutWrapper"; // 🧩 Common Navbar + Footer
import { Toaster } from "react-hot-toast"; // 🔥 Toast notifications
import { AuthProvider } from "@/context/AuthContext"; // 🔐 Authentication context

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Saloon",
  description: "Salon Booking Platform using Next.js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <AuthProvider> {/* 🔐 Provide authentication context */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              success: {
                style: {
                  background: "#d1fae5",
                  color: "#065f46",
                  fontWeight: "bold",
                },
              },
              error: {
                style: {
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontWeight: "bold",
                },
              },
            }}
          />
          <LayoutWrapper> {/* 🧩 Common layout wrapper (Navbar + Footer) */}
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
