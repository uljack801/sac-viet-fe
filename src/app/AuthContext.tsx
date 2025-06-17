"use client";
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { UserData } from "./components/type/user.type";
import { Footer } from "./components/layout/footer/Footer";
import { Header } from "./components/layout/header/Header";
import { usePathname } from "next/navigation";
import { CategoryProps, getCategory, ProductListProps, ProductProps } from "./utils/fetchCategory";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getNewAccessToken } from "./utils/getNewAccessToken";
import { getProducts } from "./utils/fetchProducts";
import { getCart } from "./utils/fetchCart";
import { getUser } from "./utils/fetchUser";
// import { Chatbox } from "./components/layout/chatbox/Chatbox";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  dataUser: UserData | null;
  setDataUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setListCategory: React.Dispatch<React.SetStateAction<CategoryProps | null>>;
  setListProducts: React.Dispatch<React.SetStateAction<ProductProps | null>>;
  listCategory: CategoryProps | null
  listProducts: ProductProps | null
  setCart: React.Dispatch<React.SetStateAction<ProductListProps[] | null>>;
  cart: ProductListProps[] | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [dataUser, setDataUser] = useState<UserData | null>(null);
  const [listCategory, setListCategory] = useState<CategoryProps | null>(null);
  const [listProducts, setListProducts] = useState<ProductProps | null>(null);
  const [cart, setCart] = useState<ProductListProps[] | null>(null);
  const [queryClient] = useState(() => new QueryClient());

  const updateAccessToken = useCallback(async () => {
    const newToken = await getNewAccessToken();
    if (newToken) {
      setAccessToken(newToken.data.accessToken);
      setTimeout(updateAccessToken, 14 * 60 * 1000);
    }
  }, [setAccessToken]);

  useEffect(() => {
    if (accessToken === null) {
      updateAccessToken()
    } else {
      getProducts({ setListProducts });
      getUser(accessToken, setDataUser);
      getCart(accessToken, setCart);
      getCategory(setListCategory)
    }
  }, [accessToken, updateAccessToken])


  const pathname = usePathname();
  const hideHeaderFooter = pathname.startsWith('/checkout') || pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forget-password") || pathname.startsWith("/seller-register") || pathname.startsWith("/seller") || pathname.startsWith("/dashboard");
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, dataUser, setDataUser, setListCategory, setListProducts, listCategory, listProducts, setCart, cart }}>
      <div className="flex flex-col min-h-screen text-[var(--color-text-root)]">
        <div>
          {!hideHeaderFooter && <Header />}
        </div>
        <div className="flex-1 flex items-center bg-[var(--color-bg-body)] ">
          <QueryClientProvider client={queryClient}>
            {children}
            {/* <div className="fixed right-6 bottom-6">
              <Chatbox/>
            </div> */}
          </QueryClientProvider>
        </div>
        <div >
          {!hideHeaderFooter && <Footer />}
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải được dùng trong AuthProvider");
  return context;
}

