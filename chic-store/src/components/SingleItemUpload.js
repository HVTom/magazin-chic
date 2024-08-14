import React, { useState } from 'react';
import Image from 'next/image';



const SingleItemUpload = ({ sizes, shoe_sizes, types, onUpload }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [description, setDescription] = useState('');

  const commonColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080', '#A52A2A', '#F5F5DC'];

  const handleAddImage = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prevImages => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    })
  }

  const handleUpload = () => {
    const uploadedItem = {
      photos: selectedImages,
      name,
      price,
      material,
      description,
      selectedSize,
      selectedColor,
      selectedType,
    };
    onUpload(uploadedItem);
  };


  // function to render the correct sizes array based on type
  const renderSizes = () => {
    const sizeOptions = selectedType === 'incaltaminte' ? shoe_sizes : sizes;

    return (
      <div className="my-8">
        <p className="text-xl font-sb mb-2">Marime</p>
        <div className="flex items-center flex-wrap">
          {sizeOptions.map((size) => (
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
    );
  };



  return (
    <div>
      <div className="my-8">
        <p className="text-xl font-sb mb-2">Poze</p>
        <input type="file" multiple onChange={handleAddImage} />
        <div className="flex flex-wrap mt-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative">
              <Image width={32} height={32} src={image} alt={`selected-${index}`} className="w-32 h-32 object-cover mr-2 mb-2" />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => handleRemoveImage(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <p className="text-xl font-sb mb-2">Nume</p>
          <div className="flex flex-row border rounded-md px-4 py-2 hover:border-black transition duration-300 ease-in-out">
            <input required type="text" placeholder="nume" value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xl font-sb mb-2">Pret</p>
          <div className="flex flex-row border rounded-md px-4 py-2 hover:border-black transition duration-300 ease-in-out">
            <input required type="number" placeholder="pret" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xl font-sb mb-2">Material</p>
          <div className="flex flex-row border rounded-md px-4 py-2 hover:border-black transition duration-300 ease-in-out">
            <input required type="text" placeholder="material" value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full" />
          </div>
        </div>
      </div>

      {/* <div className="my-8">
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
      </div> */}

      {renderSizes()}

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
        <div className="flex flex-wrap bg-gray-300 rounded w-3/4 pt-2 pl-2">
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={handleUpload}
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-yellow-500 hover:text-black"
      >
        Adauga
      </button>
    </div>
  );
};

export default SingleItemUpload;