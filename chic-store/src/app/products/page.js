'use client'
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import '../global.css';
import axios from "axios";
import ClothingItemCard from "@/components/ClothingItemCard";


export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const [clothingItems, setClothingItems] = useState([]);
  const [availableSizes, setAvailableSizes] = useState(new Set());
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [availableColors, setAvailableColors] = useState(new Set());
  const [availableMaterials, setAvailableMaterials] = useState(new Set());
  //
  const [limit, setLimit] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalCount, setTotalCount] = useState(0);


  const categories = ['Accesorii', 'Bluza', 'Camasa', 'Fusta', 'Incaltaminte', 'Palton', 'Pantaloni', 'Poseta', 'Pulover', 'Rochie'];
  const sortOptions = ['Noutati', 'Pret Mic', 'Pret Mare', 'Pret Redus', '(A - Z)', '(Z - A)'];






  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/products?limit=${limit}`);
      const newItems = response.data.items;
      setClothingItems(newItems);
      setTotalItems(response.data.totalFetched);
      setTotalCount(response.data.totalCount);

      const sizesSet = new Set();
      const colorsSet = new Set();
      const materialsSet = new Set();
      newItems.forEach((item) => {
        item.sizes.forEach((size) => {
          if (size !== "null") {
            sizesSet.add(size)
          }
        });
        if (item.colors) {
          item.colors.forEach(color => colorsSet.add(color));
        }
        if (item.material) {
          item.material.split(',').forEach(material =>
            materialsSet.add(material.trim())
          );
        }
      });
      setAvailableSizes(sizesSet);
      setAvailableColors(colorsSet);
      setAvailableMaterials(materialsSet);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [limit]);

  // Use the useEffect hook to fetch data from the API endpoint when the component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadMore = () => {
    setLimit(prevLimit => prevLimit + 10);
  };



  const searchItem = async (term) => {
    try {
      const response = await axios.get(`/api/search_item?search=${term}`)
      console.log(`Items found for ${term}`, response);
      if (response.data) {
        setClothingItems(response.data);
      }
    } catch (error) {
      console.error("Error searching data:", error);
      setClothingItems([]);
      setSearchError("Nu am găsit articole pentru termenul căutat");
    }
  }

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log(`Searching item for term ${searchTerm}`);
      searchItem(searchTerm)
    }
  }



  // sorting and filtering
  const filteredItems = clothingItems
    .filter((item) => {
      const sizeFilter =
        selectedSizes.length === 0 ||
        item.sizes.some((size) => selectedSizes.includes(size));

      const colorFilter =
        selectedColors.length === 0 ||
        (item.colors && item.colors.some(color => selectedColors.includes(color)));

      const materialFilter =
        selectedMaterials.length === 0 ||
        (item.material && selectedMaterials.some(material =>
          item.material.split(',').map(m => m.trim()).includes(material)
        ));

      const categoryFilter =
        selectedCategory === "" || item.type === selectedCategory.toLowerCase();

      const priceFilter =
        (minPrice === '' || item.price >= parseFloat(minPrice)) &&
        (maxPrice === '' || item.price <= parseFloat(maxPrice));

      return sizeFilter && colorFilter && materialFilter && categoryFilter && priceFilter;
    })
    // ... (rest of the sorting logic remains the same)
    .sort((a, b) => {
      if (selectedSortOption === "Noutati") {
        return new Date(b.added_on) - new Date(a.added_on);
      } else if (selectedSortOption === "(A - Z)") {
        return a.name.localeCompare(b.name);
      } else if (selectedSortOption === "(Z - A)") {
        return b.name.localeCompare(a.name);
      } else if (selectedSortOption === "Pret Mic") {
        return a.price - b.price;
      } else if (selectedSortOption === "Pret Mare") {
        return b.price - a.price;
      } else if (selectedSortOption === "Pret Redus") {
        // Calculate discount percentage for both items
        const discountA = a.new_price && a.new_price < a.price ? (a.price - a.new_price) / a.price : 0;
        const discountB = b.new_price && b.new_price < b.price ? (b.price - b.new_price) / b.price : 0;

        // Sort by discount percentage in descending order
        return discountB - discountA;
      }
      return 0;
    });



  const resetFilters = () => {
    setSelectedSizes([]);
    setSelectedCategory('');
    setSelectedSortOption('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSearchTerm('');
    setSearchError('');
    setLimit(5);
    fetchData();
  };



  return (
    <div className="my-12 mx-20">
      {/* Search bar */}
      <div className="flex items-center mb-4 rounded-md border border-gray-300 shadow-lg h-16 bg-white hover:border-black">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-md focus:outline-none text-lg"
          placeholder="Caută produse..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          style={{ border: 'none' }}
        />
      </div>

      <div className="flex flex-col md:flex-row md:justify-center">
        {/* Sorting and filtering bar */}
        <div className="px-12 lg:mt-3 md:mt-3 bg-white w-1/3 h-full shadow-lg">
          <div className="my-24">
            {/* Marime (size) selector */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Marime:</h3>
              <div className="flex items-center flex-wrap">
                {Array.from(availableSizes).sort().map((size) => (
                  <button
                    key={size}
                    className={`bg-gray-200 text-sm px-3 py-1 rounded-md mr-2 mb-2 ${selectedSizes.includes(size) ? 'bg-yellow-400 text-white' : ''
                      }`}
                    onClick={() => {
                      if (selectedSizes.includes(size)) {
                        setSelectedSizes(selectedSizes.filter((s) => s !== size));
                      } else {
                        setSelectedSizes([...selectedSizes, size]);
                      }
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>


            {/* Material selector */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Material:</h3>
              <div className="flex items-center flex-wrap">
                {Array.from(availableMaterials).sort().map((material) => (
                  <button
                    key={material}
                    className={`bg-gray-200 text-sm px-3 py-1 rounded-md mr-2 mb-2 ${selectedMaterials.includes(material) ? 'bg-yellow-400 text-white' : ''
                      }`}
                    onClick={() => {
                      if (selectedMaterials.includes(material)) {
                        setSelectedMaterials(selectedMaterials.filter((m) => m !== material));
                      } else {
                        setSelectedMaterials([...selectedMaterials, material]);
                      }
                    }}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>


            {/* Culoare (color) selector */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Culoare:</h3>
              <div className="flex items-center flex-wrap">
                {Array.from(availableColors).sort().map((color) => (
                  <button
                    key={color}
                    className={`
                   rounded-full mr-1 mb-1
                   ${selectedColors.includes(color)
                        ? 'ring-2 ring-yellow-400'
                        : 'hover:ring-2 hover:ring-gray-300'
                      } transition-all duration-200 ease-in-out`}
                    style={{
                      backgroundColor: color,
                      width: '1.5rem',
                      height: '1.5rem',
                    }}
                    onClick={() => {
                      if (selectedColors.includes(color)) {
                        setSelectedColors(selectedColors.filter((c) => c !== color));
                      } else {
                        setSelectedColors([...selectedColors, color]);
                      }
                    }}
                    title={color}  // This will show the color name on hover
                  />
                ))}
              </div>
            </div>


            {/* Filter by category */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Categorie:</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-yellow-500"
              >
                <option className="text-xs" value="">Opțiune</option>
                {categories.map((category) => (
                  <option className="text-xs" key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sorting options */}
            <div className="mb-4 text">
              <h3 className="text-sm font-sm mb-2">Sortare:</h3>
              <select
                value={selectedSortOption}
                onChange={(e) => setSelectedSortOption(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-yellow-500"
              >
                <option value="">Sortează</option>
                {sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div>
              <h3 className="text-sm font-medium mb-2">Interval preț:</h3>
              <div className="flex items-center overflow-x-auto">
                <input
                  type="number"
                  className="w-20 px-4 py-2 rounded-md border border-black-300 focus:outline-none focus:border-yellow-500 text-center mr-2"
                  placeholder="MIN"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <p className="text-lg font-semibold mx-2">-</p>
                <input
                  type="number"
                  className="w-20 px-4 py-2 rounded-md border border-black-300 focus:outline-none focus:border-yellow-500 text-center"
                  placeholder="MAX"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Reset Filters Button */}
            <div className="mb-4 mt-6">
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 text-black font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Resetează filtrele
              </button>
            </div>
          </div>
        </div>

        {/* Grid of card items */}
        <div className="w-full md:w-4/6 md:px-0 md:mt-0 md:mx-10 lg:ml-12 lg:mr-0 md:ml-12 md:mr-0 flex flex-col items-start">
          {filteredItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <Link href={`products/${item.id}`} key={item.id}>
                    <ClothingItemCard key={item.id} item={item} />
                  </Link>
                ))}
              </div>
              {totalItems < totalCount && (
                <button
                  onClick={loadMore}
                  className="mt-4 bg-black text-white hover:bg-yellow-400 hover:text-black font-bold py-2 px-4 rounded  transition duration-300"
                >
                  Arată mai multe
                </button>
              )}
            </>
          ) : (
            <p className="text-center font-bold text-xl">{searchError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
