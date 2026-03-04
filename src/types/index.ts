export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Proteínas' | 'Pre-Workout & Energía' | 'Recuperación' | 'Salud & Vitaminas';
  image: string;
  description: string;
  isFeatured?: boolean;
  flavors?: string[];
  inStock?: boolean; // undefined o true = con stock, false = sin stock
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  productIds: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface CartContextType {
  cart: CartState;
  addToCart: (product: Product) => void;
  addPromoToCart: (promo: Promotion) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}
