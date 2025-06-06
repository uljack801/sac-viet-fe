"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { InfoSellerProps } from "../checkout/components/ProductChoisePay";
import { getInfoSeller } from "./components/fetchInfoSeller";
import { useAuth } from "../AuthContext";
import { getNewAccessToken } from "../utils/getNewAccessToken";

interface AuthContextType {
  infoSeller: InfoSellerProps | null;
  setInfoSeller: React.Dispatch<React.SetStateAction<InfoSellerProps | null>>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderSeller({ children }: { children: ReactNode }) {
  const [infoSeller, setInfoSeller] = useState<InfoSellerProps | null>(null)
  const { accessToken, setAccessToken } = useAuth()

  const updateAccessToken = useCallback(async () => {
    const newToken = await getNewAccessToken();
    if (newToken) {
      setAccessToken(newToken.data.accessToken);
      setTimeout(updateAccessToken, 14 * 60 * 1000);
    }
  }, [setAccessToken]);

  useEffect(() => {
    if( accessToken === null){
      updateAccessToken()
    }
    if (!infoSeller && accessToken) {
      getInfoSeller(accessToken, setInfoSeller);
    }
  }, [accessToken, infoSeller, updateAccessToken]);

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
