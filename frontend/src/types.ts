export interface Product {
    _id: string;
    name: string;
    price: number;
    image?: string;
  }
  
  export interface CartItem {
    id: string;
    product: Product;
    qty: number;
    lineTotal: number;
  }
  
  export interface CartResponse {
    items: CartItem[];
    total: number;
  }
  