"use client";

import { usePathname } from "next/navigation";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import SidebarWrapper from "@/components/layout/SidebarWrapper";
import { UserSelectionGuard } from "@/components/shared/UserSelectionGuard";
import { cn } from "@/lib/utils";

export function AppLayout({ children }) {
  const pathname = usePathname();
  const isSelectUserPage = pathname === "/select-user";

  return (
    <UserSelectionGuard>
      <div className="flex flex-col min-h-screen">
        <NavbarWrapper />
        <div className={cn("flex flex-1", !isSelectUserPage && "pt-14")}>
          <SidebarWrapper />
          <main
            className={cn(
              "flex-1 overflow-y-auto transition-all duration-300",
              !isSelectUserPage && "md:pl-56",
            )}
          >
            <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
          </main>
        </div>
      </div>
    </UserSelectionGuard>
  );
}
