"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function SidebarWrapper() {
  const pathname = usePathname();
  const isSelectUserPage = pathname === "/select-user";

  if (isSelectUserPage) return null;

  return <Sidebar />;
}
