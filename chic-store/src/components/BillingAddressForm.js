// BillingAddressForm.js
'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export function BillingAddressForm({
  firstName, setFirstName,
  lastName, setLastName,
  county, setCounty,
  city, setCity,
  zipCode, handleZipCodeChange, zipCodeError,
  street, setStreet,
  phone, handlePhoneChange, phoneError,
  email, handleEmailChange, emailError,
  fullBillingDetails
}) {
  return (
    <>
      <div className="my-4">
        <p className="text-2xl font-sb mb-2">Prenume / Nume</p>
        <div className="flex flex-col mt-4 mb-4">
          <input
            type="text"
            placeholder={fullBillingDetails.billingFirstName || "Prenume"}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
            required
          />
          <input
            type="text"
            placeholder={fullBillingDetails.billingLastName || "Nume"}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out mt-4"
            required
          />
        </div>
      </div>

      <div className="my-4">
        <p className="text-2xl font-sb mb-2">Județ</p>
        <input
          type="text"
          placeholder={fullBillingDetails.billingCounty || "Introduceți județul"}
          value={county}
          onChange={(e) => setCounty(e.target.value)}
          className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
          required
        />
      </div>

      <div className="my-4">
        <p className="text-2xl font-sb mb-2">Localitate</p>
        <input
          type="text"
          placeholder={fullBillingDetails.billingCity || "Localitate"}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
          required
        />
      </div>

      <div className="my-4">
        <p className="text-2xl font-sb mb-2">Cod poștal</p>
        <input
          type="text"
          placeholder={fullBillingDetails.billingZipCode || "Cod poștal"}
          value={zipCode}
          onChange={handleZipCodeChange}
          className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
          required
        />
        {zipCodeError && <p className="text-red-500 mt-1">{zipCodeError}</p>}
        <Link target="_blank" href="https://www.posta-romana.ro/cauta-cod-postal.html">
          <p className="text-blue-500 hover:text-purple-500">Caută codul poștal</p>
        </Link>
      </div>

      <div className="my-4">
        <p className="text-2xl font-sb mb-2">Adresă: Strada Nr....</p>
        <input
          type="text"
          placeholder={fullBillingDetails.billingStreet || "Strada Număr, Bloc, Et., Ap."}
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
          required
        />
      </div>

      <div className="my-4">
        <p className="text-2xl font-sb mb-2">Telefon</p>
        <input
          type="tel"
          placeholder={fullBillingDetails.billingPhone || "07XX XXX XXX"}
          value={phone}
          onChange={handlePhoneChange}
          // onChange={(e) => setPhone(e.target.value)}
          className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
          required
        />
      </div>
      {phoneError && <p className="text-red-500 mt-1">{phoneError}</p>}


      <div className="my-4">
        <p className="text-2xl font-sb mb-2">Adresă email</p>
        <input
          type="email"
          placeholder={fullBillingDetails.billingEmail || "Adresă email"}
          onChange={handleEmailChange}
          //onChange={(e) => setEmail(e.target.value)}
          className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
          required
        />
        {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
      </div>
    </>
  );
}