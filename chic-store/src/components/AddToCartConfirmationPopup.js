import React from 'react';
import Image from 'next/image';

export const AddToCartConfirmationPopup = ({ thumbnail, itemName, selectedSize, selectedColor, price, onCancel, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Popup card */}
      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold mt-4 mb-8">Produs adăugat în coș!</h1>
          <Image src={thumbnail} width={200} height={300} alt={itemName} className="object-cover" />
          <h2 className="text-2xl font-semibold mt-4">{itemName}</h2>
          <p className="mt-2">Mărime: {selectedSize}</p>
          <div className="mt-1 flex items-center">
            <span>Culoare:</span>
            <div
              className="ml-2 w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: selectedColor }}
            ></div>
          </div>
          <p className="mt-1 text-red-600">Preț: {price} Lei</p>
          <div className="flex flex-center space-x-4">
            <button
              className="bg-gray-200 text-black px-4 py-2 rounded mt-6 hover:bg-gray-300"

              onClick={() => {
                onCancel();
                onClose();
              }}
            >
              Renunță
            </button>
            <button
              className="bg-gray-200 text-black px-4 py-2 rounded mt-6 hover:bg-gray-300"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartConfirmationPopup;