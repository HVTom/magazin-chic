'use client'
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPasswordSubmission = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('../../api/auth/forgot-password', { email });
      // Axios automatically parses the JSON response
      setMessage(response.data.message || 'Dacă există un cont cu acest email am trimis un email cu un link pentru resetarea parolei.');
      // setMessage(response.data.message || 'If an account with that email exists, we have sent a password reset link.');
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.response?.data?.error || 'A apărut o eroare. Vă rugăm încercați din nou..');
      // setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-8">Resetează Parola</h1>
      <form onSubmit={handleResetPasswordSubmission} className="w-full max-w-md">
        <div className="mb-4 mt-8">
          <h2 className="text-3xl font-semibold mb-2">Email</h2>
          <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
            </svg>
            <input
              type="email"
              placeholder="email@provider.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>
        </div>

        <button type="submit" className="bg-[#FFD700] hover:bg-black hover:text-[#FFD700] py-3 px-6 rounded mt-8 w-full">
          <p className="font-bold text-1xl">Trimite</p>
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}