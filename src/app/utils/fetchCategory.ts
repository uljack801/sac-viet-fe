
import { NEXT_PUBLIC_LOCAL } from "../helper/constant";

export type ProductProps = {
  data: [
    {
      _id: string;
      seller_id: string;
      category_id: string;
      name: string;
      img: string[];
      video: string;
      sold: number;
      discount_percentage: number;
      price: number;
      color: string[];
      material: string[];
      dimensions: string;
      origin: string;
      handmade: boolean;
      warranty: string;
      care_instructions: string;
      description: string;
      inventory: number;
      tags: string[];
      status: boolean;
      weight: number;
    }
  ];
  totalProducts?: number;
  currentPage: number;
  totalPages: number;
  message: string;
};

export type ProductListProps = {
  _id: string;
  seller_id: string;
  category_id: string;
  name: string;
  img: string[];
  video: string;
  sold: number;
  discount_percentage: number;
  price: number;
  color: string[];
  material: string[];
  dimensions: string;
  origin: string;
  handmade: boolean;
  warranty: string;
  care_instructions: string;
  description: string;
  inventory: number;
  tags: string[];
  status: boolean;
  quantity: number;
  weight: number;
};


export type ProductPropsSingle = {
  _id: string;
  seller_id: string;
  category_id: string;
  name: string;
  img: string[];
  video: string;
  sold: number;
  discount_percentage: number;
  price: number;
  color: string[];
  material: string[];
  dimensions: string;
  origin: string;
  handmade: boolean;
  warranty: string;
  care_instructions: string;
  description: string;
  inventory: number;
  tags: string[];
  status: boolean;
  weight: number;
};

export type CategoryProps = {
  data: [
    {
      _id: string;
      name: string;
      slug: string;
      icon: string;
      status: boolean;
    }
  ];
  message: string;
};
export type ArticleProps = {
  data: [
    {
      _id: string;
      title: string;
      img: string[];
      source: string;
      content: string;
      tags: string[];
      date_at: Date;
      author: string;
      views: number;
      status: string;
    }
  ];
  message: string;
};

export type ReviewProps = {
  data: [
    {
      _id: string;
      product_id: string;
      user_id: string;
      rating: number;
      comment: string;
      images: string[];
      user_name: string;
    }
  ];
  message: string;
};

export const getCategory = async (  setListCategory: React.Dispatch<React.SetStateAction<CategoryProps | null>>) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: CategoryProps = await res.json();
    return setListCategory(data);
  } catch (error) {
    console.log(error);
  }
};
