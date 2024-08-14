import Image from "next/image";
import ClothingItemCard from "@/components/ClothingItemCard";
import { ClothingItem } from "@/lib/types/types";


const Favorites = ({ item }: { item: ClothingItem }) => {
  const dummyClothingItems: ClothingItem[] = [
    {
      id: "1",
      image: "/images/hoodie.jpg",
      name: "Hoodie",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      price: 29.99,
    },
    {
      id: "2",
      image: "/images/dummy.jpg",
      name: "T-Shirt",
      description: "Nulla facilisi. Nullam id maximus velit.",
      price: 19.99,
    },
    {
      id: "3",
      image: "/images/hoodie.jpg",
      name: "Jeans",
      description: "Vestibulum mattis diam non magna consectetur.",
      price: 39.99,
    },
    {
      id: "4",
      image: "/images/jeans.png",
      name: "Jeans",
      description: "Vestibulum mattis diam non magna consectetur.",
      price: 39.99,
    },
  ];

  return (
    <div>
      {/* <h2 className="text-2xl font-sb mb-4">Listă favorites</h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Render each item in the favorites list using ClothingItemCard */}
        {dummyClothingItems.map((item) => (
          <ClothingItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;