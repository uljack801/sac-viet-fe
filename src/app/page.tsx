"use client"
import { useAuth } from "./AuthContext";
import { FetchProducts } from "./utils/fetchProduct";
import { CarouselHome } from "./components/home/CarouselHome";
import { CategoryList } from "./components/home/CategoryList";
import { ProductList } from "./components/home/ProductList";
import { ServiceHighlights } from "./components/home/ServiceHighlights ";
import { TopProductsSold } from "./components/home/TopProductsSold";

export default function Home() {
  const { listCategory, listProducts } = useAuth()
  FetchProducts();
  return (
    <div className="pt-28 2xl:mx-80 xl:mx-40">
      <CarouselHome />
      <CategoryList listCategory={listCategory} />
      <TopProductsSold  listProducts={listProducts} />
      <p className="text-3xl font-medium text-[var(--color-text-root)] flex justify-center items-center py-10">Gợi ý hôm nay</p>
      <ProductList listProducts={listProducts} />
      <ServiceHighlights />
    </div>
  );
}
