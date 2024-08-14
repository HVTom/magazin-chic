'use client';
import React, { useState } from 'react';
import Link from "next/link";

export function DeliveryAddressForm({
  fullUserDetails,
  firstName, setFirstName,
  lastName, setLastName,
  phone, setPhone, handlePhoneChange, phoneError,
  county, setCounty,
  city, setCity,
  street, setStreet,
  zipCode, setZipCode, zipCodeError,
  handleDeliveryAddress,
  handleZipCodeChange,
}) {



  return (
    <form onSubmit={handleDeliveryAddress}>
      <div className="mb-4">
        <p className="text-2xl font-sb mb-2">Nume</p>
        <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
          <input
            type="text"
            placeholder={fullUserDetails.first_name ? fullUserDetails.first_name : "Nume"}
            id="first_name"
            name="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.trim())}
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-sb mb-2">Prenume</p>
        <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
          <input
            type="text"
            placeholder={fullUserDetails.last_name ? fullUserDetails.last_name : "Prenume"}
            id="last_name"
            name="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value.trim())}
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-sb mb-2">Număr telefon</p>
        <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
          <input
            type="text"
            placeholder={fullUserDetails.phone ? fullUserDetails.phone : "07XX XXX XXX"}
            id="phone"
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            //onChange={(e) => setPhone(e.target.value.trim())}
            className="w-full"
            pattern="[0-9+\-\s()]+"
            required
          />
        </div>
        {phoneError && <p className="text-red-500 mt-1">{phoneError}</p>}
      </div>

      <div className="mb-4">
        <p className="text-2xl font-sb mb-2">Județ</p>
        <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
          <input
            type="text"
            placeholder={fullUserDetails.county ? fullUserDetails.county : "Județ"}
            id="county"
            name="county"
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-sb mb-2">Oraș</p>
        <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
          <input
            type="text"
            placeholder={fullUserDetails.city ? fullUserDetails.city : "Oraș"}
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-sb mb-2">Stradă Nr./Bloc</p>
        <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
          <input
            type="text"
            placeholder={fullUserDetails.street ? fullUserDetails.street : "Stradă/bloc"}
            id="street"
            name="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-sb mb-2">Cod poștal</p>
        <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
          <input
            type="text"
            placeholder={fullUserDetails.zip_code ? fullUserDetails.zip_code : "Cod poștal"}
            id="zip_code"
            name="zip_code"
            value={zipCode}
            onChange={handleZipCodeChange}
            maxLength={6}
            // onWheel={(e) => e.target.blur()}
            className="w-full"
            required
          />
        </div>
        {zipCodeError && <p className="text-red-500 mt-1">{zipCodeError}</p>}
        <Link target="_blank" href="https://www.posta-romana.ro/cauta-cod-postal.html">
          <p className="text-blue-500 hover:text-purple-500 mt-1">Caută codul poștal</p>
        </Link>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-md mt-2 hover:bg-[#FFD700] hover:text-black transition duration-300 ease-in-out"
      >
        {fullUserDetails.county && fullUserDetails.city && fullUserDetails.street && fullUserDetails.zip_code
          ? "Actualizează date livrare"
          : "Setează date livrare"
        }
      </button>
    </form>
  );
};