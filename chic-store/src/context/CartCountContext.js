'use client'
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios'; // Make sure to import axios

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART_COUNT':
      return { ...state, cartCount: action.payload };
    case 'INCREMENT_CART_COUNT':
      return { ...state, cartCount: state.cartCount + 1 };
    case 'DECREMENT_CART_COUNT':
      return { ...state, cartCount: Math.max(0, state.cartCount - 1) };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cartCount: 0 });

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axios.get('../api/shopping_cart/cart-count');
        dispatch({ type: 'SET_CART_COUNT', payload: response.data.count });
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);