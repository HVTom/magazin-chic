'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import OrderCard from "@/components/OrderCard";
import PersonalDataConfirmationPopup from '@/components/PersonalDataConfirmationPopup';


async function getUser() {
  try {
    const { data } = await axios.get("../../api/account");
    console.log("getUser data: ", data)
    return {
      user: data.user,
      error: null,
    };
  } catch (e) {
    console.log("getUser error: ", e);
    return {
      user: null,
      error: e,
    };
  }
}

const OrdersPage = () => {
  const [userID, setUserID] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleReturnOrder = async (orderId) => {
    try {
      await axios.put('../../api/user-orders', { orderId });
      // Update the local state to reflect the change
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: 'returnat' } : order
        )
      );
      <PersonalDataConfirmationPopup text={"Comanda a fost returnată cu succes."} />
      //alert('Comanda a fost returnată cu succes.');
    } catch (error) {
      console.error('Error returning order:', error);
      <PersonalDataConfirmationPopup text={"A apărut o eroare la returnarea comenzii. Vă rugăm să încercați din nou."} />
      //alert('A apărut o eroare la returnarea comenzii. Vă rugăm să încercați din nou.');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await getUser();
        if (user && user.userId) {
          setUserID(user.userId);
        } else {
          console.error('User not found or userId is missing');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (userID) {
        try {
          console.log('Fetching orders for userID:', userID);
          const response = await axios.get(`../../api/user-orders?userID=${userID}`);
          const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setOrders(sortedOrders || []);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [userID]);

  console.log('Current userID:', userID);
  console.log('Current orders:', orders);

  if (loading) {
    return <div>Încărcare comenzi...</div>;
  }


  return (
    <div className="flex flex-col items-start mt-8 mx-8 overflow-x-auto">
      <h2 className="text-2xl font-semibold mt-8 mb-4">Comenzi</h2>
      <div>
        {orders.length > 0 ?
          (
            orders.map((order, index) => (
              <OrderCard key={index} order={order} onReturnOrder={handleReturnOrder} />
            ))
          ) : (
            <p>Nu aveți comenzi</p>
          )}
      </div>
    </div>
  );
}

export default OrdersPage;