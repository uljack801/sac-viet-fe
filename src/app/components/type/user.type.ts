export type UserData = {
  data: {
    _id: string;
    account: string;
    email: string;
    password: string;
    token: string;
    is_authenticated: boolean;
    fullname: string;
    phoneNumber: string;
    seller_id?: string,
    avatar: string;
    date_of_birth: Date;
    gender: string;
    role: string[];
    user_address: UserAddressProps;
    ordered: Order;
    card: Card;
  };
};

export type UserAddressProps = {
  _id: string,
  user: string;
  list_address: [
    {
      _id: string;
      phone: string;
      name: string;
      address: string;
      is_default: boolean;
    }
  ];
};

export type Card = {
  user: string;
  list_products: [
    {
      productID: string;
      added_at: Date;
    }
  ];
};

export type Order = {
  user: string;
  list_products: {
    productID: string;
    quantity: number;
    order_at: Date;
  }[];
  status: string;
  payment_method: string;
  is_paid: boolean;
  paid_at: Date;
  cancelled_at: Date;
};
