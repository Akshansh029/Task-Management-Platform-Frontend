"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isSelectUserPage = pathname === "/select-user";

  if (isSelectUserPage) return null;

  return <Navbar />;
}
