'use client'
import Link from 'next/link';
import axios, { AxiosError } from "axios";
import CartItem from '@/components/CartItem';
//import { ClothingItem } from '@/lib/types/types'; // Import the ClothingItem type
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartCountContext';
import PersonalDataConfirmationPopup from "@/components/PersonalDataConfirmationPopup";



const SHIPPING_FEE = 15;
const FREE_SHIPPING_THRESHOLD = 200;


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


const Cart = () => {
  //loading
  const [isLoading, setIsLoading] = useState(true);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  //loading
  const { dispatch } = useCart();
  const router = useRouter();
  const currentPath = usePathname();
  const [isSuccess, setIsSuccess] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState();
  const [deliveryDetails, setDeliveryDetails] = useState({});
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('ramburs');
  // price calculations
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(SHIPPING_FEE);
  const [totalPrice, setTotalPrice] = useState(0);


  useEffect(() => {
    dispatch({ type: 'SET_CART_COUNT', payload: cartItems.length });
  }, [cartItems, dispatch]);

  // function to remove unavailable items
  const removeUnavailableItems = useCallback(async (unavailableItems) => {
    try {
      await axios.post('../../api/remove-unavailable-cart-items', {
        userId,
        items: unavailableItems
      });
    } catch (error) {
      console.error("Error removing unavailable items:", error);
    }
  }, [userId]);

  useEffect(() => {
    async function getCartItems() {
      if (userId) {
        setIsLoading(true);
        try {
          const response = await axios.get(`../../api/shopping_cart?userId=${userId}`);
          console.log("items: ", response.data);

          // Check availability for each item
          const { cartItems, unavailable } = await checkItemsAvailability(response.data.cartItems);

          // Remove unavailable items from the database
          if (unavailable.length > 0) {
            await removeUnavailableItems(unavailable);
            dispatch({ type: 'SET_CART_COUNT', payload: cartItems.length });
          }

          setCartItems(cartItems);
          setUnavailableItems(unavailable);
          setDeliveryDetails(response.data.userDetails);
        } catch (error) {
          console.error("Error retrieving cart items:", error);
        } finally {
          setIsLoading(false);
          setInitialFetchDone(true);
        }
      }
    }
    getCartItems();
  }, [userId, dispatch, removeUnavailableItems]);




  // Function to check item availability
  const checkItemsAvailability = async (items) => {
    const availableItems = [];
    const unavailableItems = [];

    for (const item of items) {
      try {
        console.log(`Checking availability for item: ${item.item_id}, size: ${item.size}, color: ${item.color}`);

        const response = await axios.get(`../../api/check-item-availability`, {
          params: {
            itemId: item.item_id,
            size: item.size,
            color: item.color
          }
        });

        console.log(`Availability response for item ${item.item_id}:`, JSON.stringify(response.data, null, 2));

        if (response.data.available) {
          availableItems.push(item);
        } else {
          unavailableItems.push(item);
        }
      } catch (error) {
        console.error(`Error checking availability for item ${item.item_id}:`, error);
        unavailableItems.push(item);
      }
    }

    return { cartItems: availableItems, unavailable: unavailableItems };
  };


  useEffect(() => {
    async function fetchData() {
      const { user, error } = await getUser();
      if (error || !user) {
        router.push("/login");
        return;
      }
      if (user.role !== "customer") {
        router.push("/");
        return;
      }
      setUserId(user.userId);
      setIsSuccess(true);
    }
    fetchData();
  }, [router]);




  useEffect(() => {
    const calculateTotalPrice = () => {
      const newSubtotal = cartItems.reduce((acc, item) => {
        const itemPrice = item.new_price !== undefined && item.new_price !== null ? item.new_price : item.price;
        return acc + itemPrice;
      }, 0);

      const newShippingCost = newSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
      const newTotalPrice = newSubtotal + newShippingCost;

      setSubtotal(newSubtotal);
      setShippingCost(newShippingCost);
      setTotalPrice(newTotalPrice);
    };

    calculateTotalPrice();
  }, [cartItems]);


  const deleteCartItem = async (item) => {
    try {
      const response = await axios.delete('../../api/shopping_cart', {
        data: {
          userId,
          itemId: item.item_id,
          selectedSize: item.size,
          selectedColor: item.color
        }
      });

      if (response.status === 200) {
        dispatch({ type: 'DECREMENT_CART_COUNT' });
        setCartItems(prevItems => prevItems.filter(cartItem => cartItem.cart_item_id !== item.cart_item_id));
      }
    } catch (error) {
      console.error("Error deleting cart item: ", error);
    }
  }


  const checkout = async () => {
    try {
      const { cartItems: availableItems, unavailable } = await checkItemsAvailability(cartItems);

      if (unavailable.length > 0) {
        setUnavailableItems(unavailable);
        setCartItems(availableItems);
        await removeUnavailableItems(unavailable);
        alert("Some items in your cart are no longer available and have been removed. Please review your cart before proceeding.");
        const newTotal = availableItems.reduce((acc, item) => {
          const itemPrice = item.new_price !== undefined && item.new_price !== null ? item.new_price : item.price;
          return acc + itemPrice;
        }, 0) + 15;
        setTotalPrice(newTotal);

        // Update cart count after removing unavailable items
        dispatch({ type: 'SET_CART_COUNT', payload: availableItems.length });

        return;
      }

      const orderPlacingDetails = {
        userId,
        shippingAddress: `${deliveryDetails.county}, ${deliveryDetails.city}, ${deliveryDetails.street}, ${deliveryDetails.zip_code}`,
        paymentMethod
      };

      const response = await axios.post("../../api/checkout", orderPlacingDetails);

      if (response.status === 200) {
        if (paymentMethod === 'online') {
          // Redirect to payment gateway or handle online payment
          alert("Redirecting to online payment...");
          // router.push('/payment-gateway'); // Uncomment and implement this when you have a payment gateway
        } else {
          alert("Comandă plasată cu succes! ID comandă: " + response.data.orderId);
          router.push('/order-confirmation');
        }

        // Reset cart count to 0 after successful order
        setCartItems([]);
        dispatch({ type: 'SET_CART_COUNT', payload: 0 });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("A apărut o eroare la comandă. Vă rugăm reîncercați.");
    }
  };

  if (!isSuccess) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className="text-3xl font-bold">Se încarcă...</h1>
      </div>
    )
  }

  return (
    <div className="my-12 sm:mt-20 sm:mb-40 xl:mx-64 lg:mx-20 sm:mx-20">
      <h1 className="flex justify-center text-3xl font-semibold mb-12">Coșul meu</h1>

      <div className="flex flex-col md:flex-row md:justify-center mx-2">
        <div className="w-full md:w-2/3 p-3 bg-white h-full mx-2 rounded-md">
          {unavailableItems.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p className="font-bold">Atenție!</p>
              <p>Următoarele articole nu mai sunt disponibile și au fost eliminate din coșul tău:</p>
              <ul className="list-disc list-inside">
                {unavailableItems.map(item => (
                  <li key={item.cart_item_id}>{item.name} - Mărime: {item.size}, Culoare: {item.color}</li>
                ))}
              </ul>
            </div>
          )}
          {isLoading && !initialFetchDone ? (
            <p className="flex justify-center">Se încarcă...</p>
          ) : cartItems.length > 0 ? (
            cartItems.map(item => (
              <CartItem key={item.cart_item_id} item={item} onDelete={deleteCartItem} />
            ))
          ) : (
            <p className="flex justify-center">Coșul este gol</p>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="w-full md:w-1/3 p-3 bg-white mt-8 md:mt-0 mx-2 h-full rounded-md">
            <div className="mb-8 rounded-md">
              <h2 className="text-2xl font-semibold mb-4">Detalii livrare și facturare</h2>
              {deliveryDetails.first_name && deliveryDetails.last_name && deliveryDetails.phone &&
                deliveryDetails.county && deliveryDetails.city && deliveryDetails.street && deliveryDetails.zip_code ? (
                <>
                  <div className="mb-4">
                    <p className="text-lg font-medium">Adresa de livrare:</p>
                    <p>Persoană de contact: {deliveryDetails.first_name} {deliveryDetails.last_name} - {deliveryDetails.phone}</p>
                    <p>{deliveryDetails.county}, {deliveryDetails.city}</p>
                    <p>{deliveryDetails.street}, {deliveryDetails.zip_code}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-lg font-medium">Adresa de facturare:</p>
                    {deliveryDetails.invoice_type === 'personal' ? (
                      <>
                        <p>Persoană fizică</p>
                        <p>{deliveryDetails.billing_first_name} {deliveryDetails.billing_last_name}</p>
                      </>
                    ) : (
                      <>
                        <p>Persoană juridică</p>
                        <p>Companie: {deliveryDetails.billing_company_name}</p>
                        <p>CUI: {deliveryDetails.billing_cui}</p>
                      </>
                    )}
                    <p>{deliveryDetails.billing_county}, {deliveryDetails.billing_city}</p>
                    <p>{deliveryDetails.billing_street}, {deliveryDetails.billing_zip_code}</p>
                    <p>Telefon: {deliveryDetails.billing_phone}</p>
                    <p>Email: {deliveryDetails.billing_email}</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-red-500 mb-4">Detaliile de livrare și facturare trebuie setate înainte de a plasa comanda</p>
                  <button
                    onClick={() => router.push('/account')}
                    className="bg-black text-white px-4 py-2 rounded-md mt-2 hover:bg-[#FFD700] hover:text-black inline-block"
                  >
                    Setează detaliile de livrare și facturare
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between h-full mt-4">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Sumar</h2>
                <div className="flex justify-between items-center py-2">
                  <p className="text-lg">Produse:</p>
                  <p className="text-lg">{subtotal.toFixed(2)} LEI</p>
                </div>
                <div className="flex justify-between items-center py-2">
                  <p className="text-lg">Transport:</p>
                  <p className="text-lg">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratuit</span>
                    ) : (
                      `${shippingCost.toFixed(2)} LEI`
                    )}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b py-2">
                  <p className="text-lg text-red-600">Total:</p>
                  <p className="text-lg text-red-600">{totalPrice.toFixed(2)} LEI</p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Metoda de plată:</h3>
                  <div className="flex flex-col">
                    <label className="inline-flex items-center mt-2">
                      <input
                        type="radio"
                        className="form-radio"
                        name="paymentMethod"
                        value="ramburs"
                        checked={paymentMethod === 'ramburs'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="ml-2">Ramburs (plata la curier)</span>
                    </label>
                    <label className="inline-flex items-center mt-2">
                      <input
                        type="radio"
                        className="form-radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="ml-2">Online (plata cu cardul)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-center mt-12">
                <button
                  className={`${deliveryDetails.first_name && deliveryDetails.last_name && deliveryDetails.phone &&
                    deliveryDetails.county && deliveryDetails.city && deliveryDetails.street && deliveryDetails.zip_code
                    ? "bg-[#FFD700] hover:bg-black hover:text-[#FFD700]"
                    : "bg-gray-300 cursor-not-allowed"
                    } text-black px-6 py-3 rounded-md w-full`}
                  disabled={!(deliveryDetails.first_name && deliveryDetails.last_name && deliveryDetails.phone &&
                    deliveryDetails.county && deliveryDetails.city && deliveryDetails.street && deliveryDetails.zip_code)}
                  onClick={checkout}
                >
                  {paymentMethod === 'online' ? 'Plătește Online' : 'Plasează Comanda'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default Cart;