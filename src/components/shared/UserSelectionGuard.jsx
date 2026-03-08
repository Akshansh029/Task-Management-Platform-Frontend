"use client";

import { useActiveUser } from "@/providers/ActiveUserContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function UserSelectionGuard({ children }) {
  const { activeUser, loading } = useActiveUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        const isAuthenticated = data.authenticated;

        if (
          !loading &&
          !isAuthenticated &&
          pathname !== "/login" &&
          pathname !== "/register"
        ) {
          router.push("/login");
          return;
        }

        if (
          !loading &&
          isAuthenticated &&
          !activeUser &&
          pathname !== "/select-user"
        ) {
          router.push("/select-user");
        }
      } catch (error) {
        console.error("Auth check failed", error);
        if (pathname !== "/login" && pathname !== "/register")
          router.push("/login");
      }
    };

    checkAuth();
  }, [activeUser, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Fallback for visual hiding while redirecting (optional since redirect is async)
  // We'll rely on the redirect above for total protection.
  return children;

  // If we are on the selection page, we don't want the sidebar/navbar layout
  // But wait, the Sidebar/Navbar are in the layout.js.
  // I should probably move them inside the guard or make them conditional in layout.js.
}
