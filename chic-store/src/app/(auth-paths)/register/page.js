'use client'
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { decode } from 'jsonwebtoken';
import { useRouter } from "next/navigation";
import PersonalDataConfirmationPopup from "@/components/PersonalDataConfirmationPopup";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  // supress errors if inputs haven't been touchd yet
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  // 
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);


  // Client-Side Code (Register Component)
  const handleRegister = async (event) => {
    event.preventDefault();

    const formCredentials = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    }

    try {
      const { data } = await axios.post('/api/auth/register', formCredentials, { withCredentials: true });
      console.log("Data from API:", data); // Log the data received from the API

      const decodedToken = decode(data.token); // Decode the JWT token
      console.log("Decoded token: ", decodedToken);

      const { role } = decodedToken;

      if (role === "customer") {
        router.push('/account')
      } else {
        console.log("Unknown role");
        router.push('/register')
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 409) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("A apărut o eroare în timpul înregistrării. Te rugăm să încerci din nou mai târziu.");
      }
      setShowPopup(true);
    }
  }


  function togglePassword() {
    setPasswordVisible(!passwordVisible);
  }


  // Function to validate email format
  function validateEmail(email) {
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@(?:gmail|yahoo|protonmail)\.com$/, "gm");
    const isEmailValid = emailRegex.test(email);
    // if (isEmailValid == true) {
    //   setEmailValid(true);
    // }
    return isEmailValid;
  }

  // Function to validate password format (at least 12 characters long)
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

    // setEmailValid(true);
    passErr = "";
    return passErr;
  }



  return (

    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      {showPopup && (
        <PersonalDataConfirmationPopup
          text={errorMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
      <h1 className="text-5xl font-bold mb-8">Creează Cont</h1>
      <form onSubmit={handleRegister}>
        <div className="mb-4 mt-8">
          <h2 className="text-3xl font-semibold mb-2">Email</h2>
          <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
            </svg>
            <input
              type="text"
              id="email"
              name="email"
              required
              placeholder="email@provider.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.trim());
                setEmailTouched(true);
              }}
              className="bg-transparent" //because the project has bg-none or bg-gray
            />
          </div>
          {emailTouched && !validateEmail(email) && (
            <p className="text-red-500">Introduceți o adresă de email validă</p>
          )}
        </div>

        <div className="mb-4 mt-4">
          <h2 className="text-3xl font-semibold mb-2">Password</h2>
          <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
            {passwordVisible ?
              (
                <button onClick={togglePassword} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              ) : (
                <button onClick={togglePassword} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
              )}
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              required
              placeholder="parola"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value.trim())
                setPasswordTouched(true);
              }}
              className="bg-transparent"  //because the project has bg-none or bg-gray
            />
          </div>
        </div>
        {/* Error message for invalid password */}
        <div className="flex flex- items-center justify-center mb-4 max-w-72">
          {passwordTouched && validatePassword(password) && (
            <p className="text-red-500">{validatePassword(password)}</p>
          )}
        </div>


        <div className="flex flex-col items-center justify-center">
          <button disabled={!validateEmail(email) || validatePassword(password)} id="submitBtn" type="submit" className="bg-[#FFD700] hover:bg-black hover:text-[#FFD700] py-3 px-6 rounded mt-8" >
            <p className="font-bold text-1xl">Creează</p>
          </button>
        </div>


        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="mt-2 flex">
            <p className="mr-2">Ai deja cont?</p>
            <Link href="/login"><p className="text-indigo-500 hover:text-indigo-700">Login</p></Link>
          </div>
        </div>
      </form>
    </div>
  );
}


export default Register;