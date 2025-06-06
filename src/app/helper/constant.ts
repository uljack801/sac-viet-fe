
export const SECRET_KEY = process.env.JWT_SECRET as string
export const NEXT_PUBLIC_LOCAL = process.env.NEXT_PUBLIC_LOCAL as string
export const DB_CONN_STRING = process.env.DB_CONN_STRING as string
export const EMAIL_ADMIN = process.env.EMAIL_USER as string
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN
export const CLIENT_ID = process.env.CLIENT_ID
export const CLIENT_SECRET = process.env.CLIENT_SECRET
export const GHTK_TOKEN = process.env.NEXT_PUBLIC_GHTK_TOKEN;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const phoneRegex = /^(0[3|5|7|8|9][0-9]{8}|(\+84)[3|5|7|8|9][0-9]{8})$/;
export const normalizeVietnamese = (str: string) => {
  return str
    .normalize("NFD")                     
    .replace(/[\u0300-\u036f]/g, "")   
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export const tabs = [
    { type: "Tất cả", slug: "1", status: "all" },
    { type: "Đang xử lý", slug: "2", status: "pending" },
    { type: "Vận chuyển", slug: "3", status: "shipped" },
    { type: "Hoàn thành", slug: "4", status: "delivered" },
    { type: "Đã hủy", slug: "5", status: "cancelled" },
    { type: "Trả hàng/hoàn tiền", slug: "6", status: "returned" },
];

export const handleTag = (value: string): string | undefined => {
    const tab = tabs.find(v => v.status === value);
    return tab?.type;
};