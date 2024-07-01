export interface Param {
  [x: string]: unknown;
  color: string;
  e: unknown; //string | number | [];
  error: string;
  icon: string;
  id: number;
  load: boolean;
  locale: string;
  message: string;
  method: string;
  mutate: string;
  page: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right' | 'center' | undefined;
  posts: string;
  refresh: string[];
  reload: number;
  slug: string;
  success: string;
  timeout: number;
  update: boolean;
  url: string;
}

export interface AuthPost {
  categoryName: string;
  flag: boolean;
  payments: {
    links: boolean;
    plan: null;
    start_date: null;
    token: unknown; PayerID: string; end_date: Date
  }[];
  id: number;
  user: object;
  end_date: Date | null;
  subcategory: { locales: { subcategoryName: string }[] };
  subcategoryName: string;
  subcategory_id: number;
  post_title: string | null;
  price: number;
  currency_code: 'USD';
  count: number;
  location: string;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  phone: string;
  description: string;
  user_id: number }
