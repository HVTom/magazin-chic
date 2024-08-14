'use client'
import Image from "next/image";

const ClothingItemCard = ({ item }) => {
  return (
    <div className="bg-yellow-100 rounded-lg overflow-hidden max-w-sm mx-auto sm:min-w-md lg:min-w-lg shadow-md hover:ring-2 ring-gray-400 ring-opacity-50 mt-4 mb-4 relative">
      <div>
        <Image
          src={Array.isArray(item.images) ? item.images[0] : item.image}
          alt={item.name}
          width={300}
          height={200}
          className="w-full h-auto rounded-t-lg"
        />
      </div>
      {/* Bottom white part */}
      <div className="bg-white p-4 rounded-b-lg transition-colors duration-300 hover:bg-yellow-100">
        <h2 className="text-xl font-bold mb-2 truncate" title={item.name}>{item.name}</h2>
        {item.new_price ? (
          <div className="flex justify-between items-center">
            <del className="text-lg font-semibold text-red-600">{item.price} </del>
            <p className="text-lg font-semibold"> {item.new_price} Lei</p>
          </div>
        ) : (
          <p className="text-lg font-semibold">{item.price} Lei</p>
        )}
      </div>
    </div>
  );
}

export default ClothingItemCard;







// 'use client'
// import axios from 'axios';
// import Image from "next/image";
// import { useEffect } from "react";
// import { ClothingItem } from "@/lib/types/types";




// const ClothingItemCard = ({ item }) => {
//   //solve the button on clickable item conundrum
//   // const handleClick = (e) => {
//   //   if (e.target.name === 'favoriteButton') {
//   //     e.preventDefault();
//   //     e.stopPropagation();
//   //   } else {
//   //     selectItem()
//   //   }
//   // }


//   return (
//     <div className="bg-yellow-100 rounded-lg overflow-hidden max-w-sm mx-auto sm:min-w-md lg:min-w-lg shadow-md hover:ring-2 ring-gray-400 ring-opacity-50 mt-4 mb-4 relative">
//       <div>
//         <Image
//           src={item.images[0]}
//           alt={item.name}
//           width={300} // Set the width of the image
//           height={200} // Set the height of the image
//           className="w-full h-auto rounded-t-lg"
//         />
//       </div>
//       {/* Bottom white part */}
//       <div className="bg-white p-4 rounded-b-lg transition-colors duration-300 hover:bg-yellow-100">
//         <h2 className="text-xl font-bold mb-2">{item.name}</h2>
//         {item.new_price ? (
//           <div className="flex justify-row space-between">
//             <del className="text-lg font-semibold text-red-600 mr-4">{item.price} </del>
//             <p className="text-lg font-semibold"> {item.new_price} Lei</p>
//           </div>
//         ) : (
//           <p className="text-lg font-semibold mb-4">{item.price} Lei</p>
//         )
//         }
//         {/* Add more details as needed */}
//       </div>
//     </div>
//   );
// }

// export default ClothingItemCard;
