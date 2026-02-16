import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Manager",
  description: "Task Management & Collaboration Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex items-center">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                      TaskManager
                    </Link>
                    <div className="ml-10 flex space-x-4">
                      <Link
                        href="/"
                        className="text-gray-700 hover:text-blue-600 px-3 py-2"
                      >
                        Dashboard
                      </Link>
                      <a
                        href="/projects"
                        className="text-gray-700 hover:text-blue-600 px-3 py-2"
                      >
                        Projects
                      </a>
                      <a
                        href="/users"
                        className="text-gray-700 hover:text-blue-600 px-3 py-2"
                      >
                        Users
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
