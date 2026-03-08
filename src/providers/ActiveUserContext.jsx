"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api/users";

const ActiveUserContext = createContext(undefined);

export function ActiveUserProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
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
    const isAuthPage =
      window.location.pathname === "/login" ||
      window.location.pathname === "/register";

    // Automatically fetch if we're on a non-auth page and don't have a user yet
    if (!isAuthPage && !activeUser) {
      fetchProfile();
    } else if (isAuthPage) {
      setLoading(false);
    }
  }, [activeUser]);

  return (
    <ActiveUserContext.Provider
      value={{
        activeUser,
        setActiveUser,
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
