import { NEXT_PUBLIC_LOCAL } from "../helper/constant";
import { ProductProps } from "./fetchCategory";

export const getProducts = async ({setListProducts}: {setListProducts: React.Dispatch<React.SetStateAction<ProductProps | null>>}) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ProductProps = await res.json();
    return setListProducts(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};
