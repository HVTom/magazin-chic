import React, { useState } from 'react';

const BulkItemUpload = ({ photos, name, price, material, description, sizes, types, prefilledType }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedType, setSelectedType] = useState(prefilledType);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImages, setSelectedImages] = useState(photos || []);

  const commonColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080', '#A52A2A', '#F5F5DC'];

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prevImages => [...prevImages, ...newImages]);
  };



  return (
    <div className="border hover:border-black rounded px-2">
      <div className="my-8">
        <p className="text-xl font-sb mb-2">Poze</p>
        <input type="file" multiple onChange={handleImageChange} />
        <div className="flex flex-wrap mt-4">
          {selectedImages.map((image, index) => (
            <img key={index} src={image} alt={`selected-${index}`} className="w-32 h-32 object-cover mr-2 mb-2" />
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <p className="text-xl font-sb mb-2">Nume</p>
          <div className="flex flex-row border rounded-md px-4 py-2 hover:border-black transition duration-300 ease-in-out">
            <input required type="text" placeholder="nume" defaultValue={name} className="w-full" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xl font-sb mb-2">Pret</p>
          <div className="flex flex-row border rounded-md px-4 py-2 hover:border-black transition duration-300 ease-in-out">
            <input required type="number" placeholder="pret" defaultValue={price} className="w-full" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xl font-sb mb-2">Material</p>
          <div className="flex flex-row border rounded-md px-4 py-2 hover:border-black transition duration-300 ease-in-out">
            <input required type="text" placeholder="material" defaultValue={material} className="w-full" />
          </div>
        </div>
      </div>

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
        <p className="text-xl font-sb mb-2">Tip</p>
        <div className="flex items-center flex-wrap">
          {types.map((type) => (
            <button
              key={type}
              className={`bg-gray-200 text-sm px-3 py-1 rounded-md mr-2 mb-2 ${selectedType === type ? 'bg-yellow-400 text-white' : ''}`}
              onClick={() => setSelectedType(type === selectedType ? null : type)}
            >
              {type}
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

      <div className="my-8">
        <p className="text-xl font-sb mb-2">Descriere</p>
        <textarea
          required={false}
          placeholder="Descriere produs"
          className="w-full h-32 resize-vertical border rounded-md p-2 hover:border-black transition duration-300 ease-in-out"
          defaultValue={description}
        />
      </div>
    </div>
  );
};

export default BulkItemUpload;