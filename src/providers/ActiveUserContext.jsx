"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api/users";

const ActiveUserContext = createContext(undefined);

export function ActiveUserProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    // Don't fetch if on login or register pages
    if (typeof window !== "undefined") {
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";
      if (isAuthPage) {
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      const user = await getCurrentUser();
      setActiveUser(user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setActiveUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ActiveUserContext.Provider
      value={{
        activeUser,
        setActiveUser, // Keeping this for manual updates if needed (e.g. after edit profile)
        refreshProfile: fetchProfile,
        loading,
      }}
    >
      {children}
    </ActiveUserContext.Provider>
  );
}

export function useActiveUser() {
  const context = useContext(ActiveUserContext);
  if (context === undefined) {
    throw new Error("useActiveUser must be used within an ActiveUserProvider");
  }
  return context;
}
