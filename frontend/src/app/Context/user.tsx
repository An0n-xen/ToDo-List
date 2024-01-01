"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface ContextProps {
  user: string;
  setUser: (user: string) => void;
  userId: number;
  setUserId: (userId: number) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<ContextProps>({
  user: "",
  setUser: (): string => "",
  userId: 0,
  setUserId: (): number => 0,
  isLoggedIn: false,
  setIsLoggedIn: (): boolean => false,
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider
      value={{ user, setUser, userId, setUserId, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
