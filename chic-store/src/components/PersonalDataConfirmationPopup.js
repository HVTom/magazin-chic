import React from 'react';

export const PersonalDataConfirmationPopup = ({ text, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Popup card */}
      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="flex flex-col items-center">
          <h1 className="text-center text-2xl font-semibold mt-4 mb-8">{text}</h1>

          <div className="flex flex-center space-x-4">
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

export default PersonalDataConfirmationPopup;