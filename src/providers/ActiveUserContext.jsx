"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUsers } from "@/lib/api/users";

const ActiveUserContext = createContext(undefined);

export function ActiveUserProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);
  const [users, setUsers] = useState({ content: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const fetchedUsers = await getUsers(0, 50); // Fetch a larger batch for selection
        setUsers(fetchedUsers);

        const storedId = localStorage.getItem("activeUserId");
        if (storedId) {
          const user = fetchedUsers.content?.find(
            (u) => u.id.toString() === storedId,
          );
          if (user) {
            setActiveUser(user);
          }
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const handleSetActiveUser = (user) => {
    if (user) {
      localStorage.setItem("activeUserId", user.id.toString());
      setActiveUser(user);
    } else {
      localStorage.removeItem("activeUserId");
      setActiveUser(null);
    }
  };

  return (
    <ActiveUserContext.Provider
      value={{
        activeUser,
        setActiveUser: handleSetActiveUser,
        users,
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
