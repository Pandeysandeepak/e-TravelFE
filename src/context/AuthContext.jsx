import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock users database
const MOCK_USERS = [
  { id: 1, email: 'admin@bus.com', password: 'admin123', role: 'ADMIN', name: 'Admin User' },
  { id: 2, email: 'owner@bus.com', password: 'owner123', role: 'OWNER', name: 'Bus Owner' },
  { id: 3, email: 'user@bus.com', password: 'user123', role: 'USER', name: 'Passenger User' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('busTrackerUser');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      const token = btoa(JSON.stringify({ userId: foundUser.id, role: foundUser.role }));
      const userData = { ...userWithoutPassword, token };
      setUser(userData);
      localStorage.setItem('busTrackerUser', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid credentials' };
  }, []);

  const register = useCallback(async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const exists = MOCK_USERS.find(u => u.email === userData.email);
    if (exists) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: MOCK_USERS.length + 1,
      ...userData,
      role: 'USER',
    };

    MOCK_USERS.push(newUser);
    const token = btoa(JSON.stringify({ userId: newUser.id, role: newUser.role }));
    const userWithoutPassword = { id: newUser.id, email: newUser.email, name: newUser.name, role: 'USER', token };
    setUser(userWithoutPassword);
    localStorage.setItem('busTrackerUser', JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('busTrackerUser');
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isOwner: user?.role === 'OWNER',
    isUser: user?.role === 'USER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}