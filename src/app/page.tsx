"use client"
import { useAuth } from "./AuthContext";
import { CarouselHome } from "./components/home/CarouselHome";
import { CategoryList } from "./components/home/CategoryList";
import { ProductList } from "./components/home/ProductList";
import { ServiceHighlights } from "./components/home/ServiceHighlights ";
import { TopProductsSold } from "./components/home/TopProductsSold";

export default function Home() {
  const { listCategory, listProducts } = useAuth()
  return (
    <div className="pt-28 max-xl:mx-0 max-2xl:mx-36 mx-96 ">
      <CarouselHome />
      <CategoryList listCategory={listCategory} />
      <TopProductsSold  listProducts={listProducts} />
      <p className="max-sm:text-xl max-sm:py-4 max-lg:text-2xl max-lg:py-6 max-xl:py-10 max-xl:text-3xl text-3xl py-10 font-medium text-[var(--color-text-root)] text-center">Gợi ý hôm nay</p>
      <ProductList listProducts={listProducts} />
      <ServiceHighlights />
    </div>
  );
}
