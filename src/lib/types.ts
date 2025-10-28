export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Accessory {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export interface Flower {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
}

export interface CartAccessory {
  accessory: Accessory;
  quantity: number;
}

export interface CartItem extends Flower {
  cartId: string;
  quantity: number;
  selectedAccessories?: CartAccessory[];
}
