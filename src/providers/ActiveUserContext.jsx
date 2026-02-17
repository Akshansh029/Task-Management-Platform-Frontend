'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getUsers } from '@/lib/api/users';

const ActiveUserContext = createContext(undefined);

export function ActiveUserProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all users on mount
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        // Set first user as default active user
        if (fetchedUsers.length > 0) {
          setActiveUser(fetchedUsers[0]);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ActiveUserContext.Provider value={{ activeUser, setActiveUser, users, loading }}>
      {children}
    </ActiveUserContext.Provider>
  );
}

export function useActiveUser() {
  const context = useContext(ActiveUserContext);
  if (context === undefined) {
    throw new Error('useActiveUser must be used within an ActiveUserProvider');
  }
  return context;
}
