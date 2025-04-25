import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper"; // Nav + Footer
import { Toaster } from "react-hot-toast"; // 🔥 Toast support

const font = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "The Saloon",
  description: "Saloon Landing page using Next js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} /> {/* ✅ Toasts */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
