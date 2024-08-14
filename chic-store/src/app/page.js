'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import ClothingItemCard from "@/components/ClothingItemCard";
import Link from 'next/link';

const Home = () => {
  const [discountedItems, setDiscountedItems] = useState([]);
  const [newItems, setNewItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/root_page");

        const currentDate = new Date();
        const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 15));

        // Use a Map to ensure unique items based on ID
        const itemMap = new Map(data.map(item => [item.id, item]));

        // Filter for discounted items
        const discountedItems = Array.from(itemMap.values())
          .filter(item => item.new_price && item.new_price < item.price);

        // Filter for new items, excluding those already in discounted items
        const newItems = Array.from(itemMap.values())
          .filter(item => {
            const addedDate = new Date(item.added_on);
            return addedDate >= thirtyDaysAgo && !discountedItems.some(discountedItem => discountedItem.id === item.id);
          });

        setDiscountedItems(discountedItems);
        setNewItems(newItems);
      } catch (error) {
        console.log("A aparut o eroare la citirea articolelor:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col items-center justify-even mb-12 overflow-x-hidden'>
      <div className="flex flex-col items-center w-full max-w-screen-xl px-4 mb-12">
        <Image
          src='/images/logo.svg'
          alt='Logo image'
          className="mt-16"
          width={150}
          height={50}
        />
        {/* Use a fancy font here */}
        <p className="text-3xl font-bold mt-4">Magazin cu articole de damă</p>
      </div>

      <div className="flex flex-col items-center w-full max-w-6xl px-4 mt-8 mb-12 mx-auto">
        <p className="flex justify-start text-2xl font-semibold mb-4">Discount-urile momentului</p>
        <div className="flex flex-row flex-wrap gap-6 justify-center">
          {discountedItems.map((item) => (
            <Link href={`products/${item.id}`} key={item.id}>
              <ClothingItemCard key={item.id} item={item} />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-6xl px-4 mt-12 mx-auto">
        <p className="text-left text-2xl font-semibold mb-4">Noutăți</p>
        <div className="flex flex-row flex-wrap gap-6 justify-center">
          {newItems.map((item) => (
            <Link href={`products/${item.id}`} key={item.id}>
              <ClothingItemCard key={item.id} item={item} />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-row self-center justify-between group hover:cursor-pointer px-4 my-24">
        <Link href={'products'}>
          <p className="text-left text-xl group-hover:text-3xl text-2xl font-bold text-indigo-700 group-hover:text-indigo-800 transition-all duration-300 relative">
            <span className="relative inline-block">
              Descoperă întreaga colecție &gt;
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-800 group-hover:w-full transition-all duration-400"></span>
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
