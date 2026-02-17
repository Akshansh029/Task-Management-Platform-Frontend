import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/providers/QueryProvider";
import { ActiveUserProvider } from "@/providers/ActiveUserContext";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "TaskManager | Collaborate & Conquer",
  description: "A modern task management and collaboration platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <QueryProvider>
          <ActiveUserProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </ActiveUserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
