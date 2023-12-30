"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface ContextProps {
  user: string;
  setUser: (user: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<ContextProps>({
  user: "",
  setUser: (): string => "",
  isLoggedIn: false,
  setIsLoggedIn: (): boolean => false,
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
