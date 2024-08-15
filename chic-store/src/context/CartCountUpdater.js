'use client'
import { useEffect } from 'react';
import { useCart } from '@/context/CartCountContext';
import axios from 'axios';

const CartCountUpdater = () => {
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axios.get('/api/shopping_cart/cart-count');
        dispatch({ type: 'SET_CART_COUNT', payload: response.data.count });
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default CartCountUpdater;