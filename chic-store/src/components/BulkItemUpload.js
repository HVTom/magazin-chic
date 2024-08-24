import React, { useState, useEffect } from 'react';


const BulkItemUpload = ({ photos, name, price, material, type, sizes, description, onDataChange }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const commonColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080', '#A52A2A', '#F5F5DC'];

  useEffect(() => {
    onDataChange({
      photos,
      name,
      price,
      material,
      type,
      selectedSize,
      selectedColor,
      description,
    });
  }, [photos, name, price, material, type, selectedSize, selectedColor, description, onDataChange]);




  return (
    <div className="border hover:border-black rounded px-2">

      <div className="my-8">
        <p className="text-xl font-sb mb-2">Marime</p>
        <div className="flex items-center flex-wrap">
          {sizes.map((size) => (
            <button
              key={size}
              className={`bg-gray-200 text-sm px-3 py-1 rounded-md mr-2 mb-2 ${selectedSize === size ? 'bg-yellow-400 text-white' : ''}`}
              onClick={() => setSelectedSize(size === selectedSize ? null : size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>


      <div className="my-8">
        <p className="text-xl font-sb mb-2">Culoare</p>
        <div className="flex items-center flex-wrap">
          {commonColors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full mr-2 mb-2 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-yellow-400' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(selectedColor === color ? null : color)}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default BulkItemUpload;