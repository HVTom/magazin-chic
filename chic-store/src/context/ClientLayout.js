//ClientLayout.js
'use client'
import { CartProvider } from "@/context/CartCountContext";
import CartCountUpdater from './CartCountUpdater';
import { usePathname } from 'next/navigation';

const ClientLayout = ({ children }) => {
  const pathname = usePathname();

  return (
    <CartProvider>
      {/* {pathname !== '/' && <CartCountUpdater />} */}
      <CartCountUpdater />
      {children}
    </CartProvider>
  );
};

export default ClientLayout;