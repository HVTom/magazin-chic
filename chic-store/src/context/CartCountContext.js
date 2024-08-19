// 'use client'
// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import axios from 'axios';

// const CartContext = createContext();

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_CART_COUNT':
//       return { ...state, cartCount: action.payload };
//     case 'INCREMENT_CART_COUNT':
//       return { ...state, cartCount: state.cartCount + 1 };
//     case 'DECREMENT_CART_COUNT':
//       return { ...state, cartCount: Math.max(0, state.cartCount - 1) };
//     default:
//       return state;
//   }
// };

// export const CartProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, { cartCount: 0 });

//   useEffect(() => {
//     console.log('Cart count changed:', state.cartCount);
//   }, [state.cartCount]);

//   useEffect(() => {
//     const storedCount = localStorage.getItem('cartCount');
//     if (storedCount) {
//       dispatch({ type: 'SET_CART_COUNT', payload: parseInt(storedCount, 10) });
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('cartCount', state.cartCount.toString());
//   }, [state.cartCount]);

//   useEffect(() => {
//     const fetchCartCount = async () => {
//       // Check if user is authenticated
//       const token = localStorage.getItem('token'); // Adjust this based on how you store the token
//       if (!token) {
//         console.log('User not authenticated. Cart count set to 0.');
//         dispatch({ type: 'SET_CART_COUNT', payload: 0 });
//         return;
//       }

//       try {
//         const response = await axios.get('/api/shopping_cart/cart-count', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         dispatch({ type: 'SET_CART_COUNT', payload: response.data.count });
//       } catch (error) {
//         console.error('Error fetching cart count:', error);
//         // Handle error - maybe set cart count to 0 or show a user-friendly message
//         dispatch({ type: 'SET_CART_COUNT', payload: 0 });
//       }
//     };

//     fetchCartCount();
//   }, []);

//   return (
//     <CartContext.Provider value={{ state, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);


'use client'
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

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
    console.log('Cart count changed:', state.cartCount);
  }, [state.cartCount]);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axios.get('/api/shopping_cart/cart-count');
        dispatch({ type: 'SET_CART_COUNT', payload: response.data.count });
      } catch (error) {
        console.error('Error fetching cart count:', error);
        dispatch({ type: 'SET_CART_COUNT', payload: 0 });
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