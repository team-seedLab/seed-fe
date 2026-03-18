import { createContext, useContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
