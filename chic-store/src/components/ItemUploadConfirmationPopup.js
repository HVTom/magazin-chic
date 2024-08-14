import React from 'react';
import Image from 'next/image';

const ItemUploadConfirmationPopup = ({ itemName, quantity, price, thumbnail, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Popup card */}
      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-6">Articol adăugat!</h1>
          {thumbnail && (
            <div className="mb-4">
              <Image
                src={URL.createObjectURL(thumbnail)}
                width={200}
                height={200}
                alt={itemName}
                className="object-cover rounded-md"
              />
            </div>
          )}
          <h2 className="text-xl font-semibold mb-4">{itemName}</h2>
          <p className="mb-2">Quantity: {quantity}</p>
          <p className="mb-4 text-red-600">Price: {price} Lei</p>
          <button
            className="bg-black text-white px-6 py-2 rounded hover:bg-yellow-500 hover:text-black transition duration-300"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemUploadConfirmationPopup;