"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { InfoSellerProps } from "../checkout/components/ProductChoisePay";

interface AuthContextType {
  infoSeller: InfoSellerProps | null;
  setInfoSeller: React.Dispatch<React.SetStateAction<InfoSellerProps | null>>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderSeller({ children }: { children: ReactNode }) {
  const [infoSeller, setInfoSeller] = useState<InfoSellerProps | null>(null)

  return (
    <AuthContext.Provider value={{ infoSeller, setInfoSeller }}>
      <div className="w-full">
        {children}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuthSeller() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải được dùng trong AuthProviderSeller");
  return context;
}
