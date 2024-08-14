'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import '../../global.css';
import Image from 'next/image';
import axios, { AxiosError } from "axios";
import { getUserId } from "@/utils/getUserId";
import AddToCartConfirmationPopup from "../../../components/AddToCartConfirmationPopup";
import { useCart } from '@/context/CartCountContext';


const ProductDetails = ({ params }) => {
  const { dispatch } = useCart();
  const [itemData, setItemData] = useState();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Initially select the first image
  const [allSizes, setAllSizes] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizeColorCombinations, setSizeColorCombinations] = useState([]);
  const [listOfMaterials, setListOfMaterials] = useState();
  const [description, setDescription] = useState('');
  const [colorError, setColorError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = await getUserId();
        setIsAuthenticated(!!userId)
      } catch (error) {
        console.error("Error checking authentication", error);
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/products/${params.productId}`);
        const data = response.data;
        console.log("DATA INSIDE PRODUCT_DETAILS: ", data);
        setItemData(data);
        setId(data.id);
        setImages(data.images);
        setName(data.name);
        setPrice(data.price);
        setNewPrice(data.new_price);
        setAllSizes(data.sizes || []);
        setAllColors(data.colors || []);
        setSizeColorCombinations(data.sizeColorCombinations);
        setListOfMaterials(data.material.split(','));
        setDescription(data.description);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.productId]);

  console.log("DATA INSIDE PRODUCT_DETAILS AFTER SETSTATE: ", itemData);



  // set and select images
  useEffect(() => {
    setSelectedImageIndex(0); // Reset selected image index when component unmounts
  }, []);



  function handlePreviousImage() {
    setSelectedImageIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      return newIndex;
    });
  }

  function handleNextImage() {
    setSelectedImageIndex((prevIndex) => {
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });
  }




  // size-color combinations
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setSelectedColor(null); // Reset color when size changes
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const getAvailableColors = (size) => {
    if (!size) return allColors;
    return sizeColorCombinations
      .filter(combo => combo.size === size)
      .map(combo => combo.color);
  };

  const isValidCombination = (size, color) => {
    return sizeColorCombinations.some(combo => combo.size === size && combo.color === color);
  };






  // Function to determine text color based on background color
  function getTextColor(bgColor) {
    // Convert background color to hexadecimal format
    let hexColor = bgColor.replace(/^#/, '');

    // Calculate brightness
    let brightness = Math.round(((parseInt(hexColor, 16) & 0xff0000) * 0.299) +
      ((parseInt(hexColor, 16) & 0x00ff00) * 0.587) +
      ((parseInt(hexColor, 16) & 0x0000ff) * 0.114));

    // Return black or white text color based on brightness
    return brightness > 186 ? '#000000' : '#ffffff';
  }



  async function addToCart() {
    if (itemData.quantity === 0) {
      console.log("Produsul nu este disponibil");
      return;
    }

    if (!selectedSize || !selectedColor) {
      console.log("Vă rugăm să selectați maărimea și culoarea");
      return;
    }


    if (!isAuthenticated) {
      console.log("Trebuie să fiți autentificat pentru a adăuga în coș");
      // Here you can redirect to login page or show a login modal
      // For example:
      // router.push('/login');
      return;
    }

    try {
      const userId = await getUserId();

      const cartItem = {
        userId,
        itemId: parseInt(id, 10),  // Ensure this is a number
        selectedSize,
        selectedColor,
      };

      console.log("ITEM DETAILS: ", cartItem);

      const response = await axios.post('/api/shopping_cart', cartItem);
      console.log("Response: ", response.data)
      if (response.status == 200) {
        dispatch({ type: 'INCREMENT_CART_COUNT' });
        const { message } = response.data
        console.log(message);
        setShowConfirmation(true);
      } else {
        console.error("Eroare la adaugare in cos. Status: ", response.status);
      }
      //console.log("Item added to cart:", cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      setColorError("Eroare la adăugarea în coș");
    }

  }


  async function removeFromCart() {
    try {
      const userId = await getUserId();
      const response = await axios.delete('/api/shopping_cart', {
        data: {
          userId,
          itemId: parseInt(id, 10),
          selectedSize,
          selectedColor
        }
      });
      if (response.status === 200) {
        console.log("Item removed from cart");
      } else {
        console.error("Eroare la stergerea din cos. Status: ", response.status);
      }
    } catch (error) {
      console.error("Error removing from cart:", error.response?.data || error.message);
    }
  }



  if (!itemData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    )  // Render a loading state while itemData is being fetched
  }


  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      {showConfirmation && (
        <AddToCartConfirmationPopup
          thumbnail={images[0]}
          itemName={name}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          price={newPrice ? newPrice : price}
          onCancel={removeFromCart}
          onClose={() => setShowConfirmation(false)}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left half with image carousel */}
        <div className="flex flex-col mt-8">
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
              onClick={handlePreviousImage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="flex items-center justify-center">
              <Image
                src={images[selectedImageIndex]}
                width={300}
                height={500}
                alt={itemData.name}
                className="max-w-full h-auto"
              />
            </div>

            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
              onClick={handleNextImage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <div className="flex overflow-x-auto max-w-xs">
              {/* Display thumbnails of images */}
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  width={48}
                  height={48}
                  alt={`Picture ${index + 1}`}
                  className={`mx-2 cursor-pointer border flex-shrink-0 ${selectedImageIndex === index ? 'border-gray-500' : 'border-transparent'
                    }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>



        {/* Right half with item details */}
        {/*ALSO ADD ASSOCIATED SIZES AND COLORS*/}
        <div className="">
          <div className="mx-12">
            <h2 className="text-3xl font-semibold mb-4">{itemData.name}</h2>
            <h2 className="text-3xl font-semibold mb-4 text-red-700">Item id {itemData.id}</h2>
            {itemData.quantity > 1 && itemData.quantity <= 10 ? (<h2 className="text-3xl font-semibold mb-4 text-red-700">Mai sunt {itemData.quantity} articole</h2>) : ""}
            {itemData.quantity == 1 ? (<h2 className="text-3xl font-semibold mb-4 text-red-700">Mai este {itemData.quantity} articol</h2>) : ""}
            {newPrice ? (
              <div className="flex justify-row space-between">
                <del className="text-2xl text-red-600 font-bold mr-4">{itemData.price} </del>
                <p className="text-2xl text-green-600 font-bold"> {newPrice} Lei</p>
              </div>
            ) : (
              <p className="text-2xl font-bold mb-4">{itemData.price} Lei</p>
            )
            }
            <div className="mb-4 mt-8 items-center">
              <p className="text-2xl font-bold mr-6">Mărime:</p>
              {allSizes.sort().map((size, index) => (
                <button
                  key={index}
                  className={`bg-white text-md px-3 py-1 rounded-md mr-2 mt-4 mb-4 cursor-pointer
                    ${selectedSize === size ? 'bg-yellow-300 text-black cursor-pointer' : 'text-gray-600 cursor-pointer'}`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="mb-2 items-center flex-wrap">
              <p className="text-2xl font-semibold mb-4 mr-6">Culoare:</p>
              {allColors.map((color, index) => (
                <button
                  key={index}
                  className={`bg-white text-md px-4 py-4 rounded-full mr-2 mb-4
                  ${selectedColor === color ? 'ring-2 ring-yellow-500' : ''}
                  ${!getAvailableColors(selectedSize).includes(color) ? 'opacity-5' : 'hover:opacity-80'}`}
                  style={{
                    backgroundColor: color,
                    color: getTextColor(color),
                    cursor: !getAvailableColors(selectedSize).includes(color) ? 'cursor-not-allowed' : 'cursor-pointer',
                  }}
                  onClick={() => handleColorChange(color)}
                  disabled={!getAvailableColors(selectedSize).includes(color)}
                />
              ))}
            </div>
            {/* Add to cart button */}
            <button
              onClick={addToCart}
              className={`bg-[#FFD700] text-black hover:bg-black hover:text-[#FFD700] px-6 py-3 rounded-md font-medium mt-4 mb-4 ${!isAuthenticated || itemData.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={!isAuthenticated || itemData.quantity === 0}
            >
              {!isAuthenticated
                ? 'Autentificați-vă pentru a adăuga produse în coș'
                : itemData.quantity === 0
                  ? 'Produs indisponibil'
                  : 'Adaugă în coș'}
            </button>
            {/* <button
              onClick={addToCart}
              className={`bg-[#FFD700] text-black hover:bg-black hover:text-[#FFD700] px-6 py-3 rounded-md font-medium mt-4 mb-4 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? 'Adaugă în coș' : 'Autentificați-vă pentru a adăuga produse în coș'}
            </button> */}
            {/* Materiale */}
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-4">Materiale</h2>
              <div className="flex flex-wrap">
                {listOfMaterials.map((material, index) => (
                  <p
                    key={index}
                    className="bg-white text-gray-600 text-md px-3 py-1 rounded-md mr-2 mt-2 mb-2"
                  >
                    {material}
                  </p>
                ))}
              </div>
            </div>
            {/* Description */}
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-4">Descriere</h2>
              <p className="text-gray-600 mb-4">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}


export default ProductDetails;