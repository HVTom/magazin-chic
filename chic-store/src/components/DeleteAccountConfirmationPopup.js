import React from 'react';

export const DeleteAccountConfirmationPopup = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onCancel}></div>

      {/* Popup content */}
      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4 z-10">
        <div className="flex flex-col items-center">
          <h1 className="text-center text-2xl font-semibold mt-4 mb-8">Ești sigur că dorești să ștergi contul?</h1>

          <div className='flex flex-row space-x-4'>
            <button
              className="bg-gray-200 text-black px-4 py-2 rounded mt-6 hover:bg-gray-300"
              onClick={onCancel}
            >
              Renunță
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-6 hover:bg-red-600"
              onClick={onConfirm}
            >
              Confirmă
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountConfirmationPopup;