import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/providers/QueryProvider";
import { ActiveUserProvider } from "@/providers/ActiveUserContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });

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
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex flex-1 pt-14">
                <Sidebar />
                <main className="flex-1 md:ml-56 p-4 md:p-8 overflow-y-auto">
                  <div className="max-w-7xl mx-auto">
                    {children}
                  </div>
                </main>
              </div>
            </div>
            <Toaster />
          </ActiveUserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
