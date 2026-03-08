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
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (
      !loading &&
      !token &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      router.push("/login");
      return;
    }

    if (!loading && token && !activeUser && pathname !== "/select-user") {
      // If we have a token but no active user (persona/profile), go to select-user
      router.push("/select-user");
    }
  }, [activeUser, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // If not on auth/selection page and no token/user, don't render anything while redirecting
  if (!token && pathname !== "/login" && pathname !== "/register") {
    return null;
  }

  if (
    token &&
    !activeUser &&
    pathname !== "/select-user" &&
    pathname !== "/login" &&
    pathname !== "/register"
  ) {
    return null;
  }

  // If we are on the selection page, we don't want the sidebar/navbar layout
  // But wait, the Sidebar/Navbar are in the layout.js.
  // I should probably move them inside the guard or make them conditional in layout.js.

  return children;
}
