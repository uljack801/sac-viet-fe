export type ListProductProps = {
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

export type ProductOrders = {
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

export type ProductDetails = {
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

export type dataProductUpdate = {
  productID?: string;
  seller_id?: string;
  category_id?: string;
  name: string;
  img: string[];
  discount_percentage: number;
  price: number;
  color: string[];
  material: string[];
  dimensions: string;
  origin: string;
  warranty: string;
  care_instructions: string;
  description: string;
  inventory: number;
  tags: string[];
  weight: number;
};

export type ListOrderProps = {
  _id: string;
  products: [
    {
      productID: string;
      quantity: number;
      weight: number;
      productName: string;
    }
  ];
  shipping_fees: { [sellerId: string]: number };
  seller_id: string;
  order_at: Date;
  address_ship: string;
  total_money_ship: number;
  status: string;
  payment_method: string;
  is_paid: boolean;
  paid_at: Date;
  is_review: boolean;
  cancelled_at: Date;
  note: string;
  totalPay: number;
};

export type AddressProps = {
  _id: string;
  phone: string;
  name: string;
  address: string;
  is_default: boolean;
};
