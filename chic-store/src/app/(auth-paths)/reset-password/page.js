'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const router = useRouter();

  // Function to validate password format
  function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@._#$!%*?&]{12,30}$/;
    let passErr = "";
    if (!passwordRegex.test(password)) {
      if (!/(?=.*[a-z])/.test(password)) {
        passErr = "Parola trebuie să conțină cel puțin o literă mică";
        return passErr;
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        passErr = "Parola trebuie să conțină cel puțin o literă mare";
        return passErr;
      }
      if (!/(?=.*\d)/.test(password)) {
        passErr = "Parola trebuie să conțină cel puțin o cifră";
        return passErr;
      }
      if ((password.match(/[@.#$!%*?&]/g) || []).length < 4) {
        passErr = "Parola trebuie să conțină cel puțin 4 caracter speciale (_@.#$!%*?&)";
        return passErr;
      }
      if (password.length < 12) {
        passErr = "Parola trebuie să conțină minim 12 caractere";
        return passErr;
      }
    }
    passErr = "";
    return passErr;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (validatePassword(password)) {
      setMessage(validatePassword(password));
      return;
    }

    try {
      const token = new URLSearchParams(window.location.search).get('token');
      const response = await axios.post('/api/auth/reset-password', { token, password });
      setMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else if (field === 'confirmPassword') {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-8">Resetează Parola</h1>
      <form onSubmit={handleSubmit} autoComplete='off' className="w-full max-w-md">
        <div className="mb-4 mt-8">
          <h2 className="text-3xl font-semibold mb-2">Parola Nouă</h2>
          <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
            <button onClick={() => togglePasswordVisibility('password')} type="button">
              {passwordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Introduceți parola nouă"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value.trim());
                setPasswordTouched(true);
              }}
              required
              className="w-full focus:outline-none bg-transparent"
              autoComplete="new-password"
            />
          </div>
          {passwordTouched && validatePassword(password) && (
            <p className="text-red-500 mt-2">{validatePassword(password)}</p>
          )}
        </div>

        <div className="mb-4 mt-8">
          <h2 className="text-3xl font-semibold mb-2">Confirmă Parola</h2>
          <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
            <button onClick={() => togglePasswordVisibility('confirmPassword')} type="button">
              {confirmPasswordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirmați parola nouă"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value.trim());
                setConfirmPasswordTouched(true);
              }}
              required
              className="w-full focus:outline-none bg-transparent"
              autoComplete="new-password"
            />
          </div>
          {confirmPasswordTouched && password !== confirmPassword && (
            <p className="text-red-500 mt-2">Parolele nu se potrivesc</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-[#FFD700] hover:bg-black hover:text-[#FFD700] py-3 px-6 rounded mt-8 w-full"
          disabled={validatePassword(password) !== "" || password !== confirmPassword}
        >
          <p className="font-bold text-1xl">Resetează Parola</p>
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}