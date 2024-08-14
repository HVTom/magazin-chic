// types.ts

// used for the product's details page 
export type ClothingItemInfo = {
  id: string;
  images: string[];
  name: string;
  description: string;
  price: number;
  color: string[];
  size: string[];
}


// used for the products page card items
export type ClothingItem = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
}


// used to encapsulate multiple items
export type Order = {
  id: string;
  date: string;
  amount: number;
  items: OrderItem[];
};

// item for the order's item list
export type OrderItem = {
  id: string;
  name: string;
  images: string[];
};


// user type
export type User = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  address: Record<string, any>;
  role: string;
};


export type Employee = {
  employee_id: number;
  employee_name: string;
  salary: number;
}
