'use client'
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { PersonalDataConfirmationPopup } from "@/components/PersonalDataConfirmationPopup";
import { DeleteAccountConfirmationPopup } from "@/components/DeleteAccountConfirmationPopup";
import { DeliveryAddressForm } from "@/components/DeliveryAddressForm";
import { BillingAddressForm } from "@/components/BillingAddressForm";


async function getUser() {
  try {
    const { data } = await axios.get("../../api/account");
    console.log("getUser data: ", data)
    return {
      user: data.user,
      error: null,
    };
  } catch (e) {
    console.log("getUser error: ", e);
    return {
      user: null,
      error: e,
    };
  }
}



const PersonalData = () => {
  const [userID, setUserID] = useState('');
  // delivery address data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');
  const [showDeliveryAddress, setShowDeliveryAddress] = useState(false);
  // email
  const [email, setEmail] = useState('');
  const [fullUserDetails, setFullUserDetails] = useState({});
  // popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  // delete account popup
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  // billing address
  const [invoiceType, setInvoiceType] = useState('');
  const [billingFirstName, setBillingFirstName] = useState('');
  const [billingLastName, setBillingLastName] = useState('');
  const [billingCounty, setBillingCounty] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingZipCode, setBillingZipCode] = useState('');
  const [billingStreet, setBillingStreet] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingCUI, setBillingCUI] = useState('');
  const [billingCompanyName, setBillingCompanyName] = useState('');
  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const [isValidZipCode, setIsValidZipCode] = useState(true);
  // placeholders data
  const [fullBillingDetails, setFullBillingDetails] = useState({});
  // tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  // phone err
  const [phoneError, setPhoneError] = useState('');
  // errs
  const [billingPhoneError, setBillingPhoneError] = useState('');
  const [billingZipCodeError, setBillingZipCodeError] = useState('');
  const [billingEmailError, setBillingEmailError] = useState('');




  useEffect(() => {
    async function fetchData() {
      const { user, error } = await getUser();
      if (error || !user) {
        console.log("Error fetching user:", error);
        return;
      }
      console.log("Fetched user:", user);
      if (user.role === "customer" && user.userId) {
        console.log("Setting userID:", user.userId);
        setUserID(user.userId);
      } else {
        console.log("No userId found in user object");
      }
    }
    fetchData();
  }, []);

  // console.log("Personal DATA page: ", userID);

  useEffect(() => {
    const fetchFullUserDetails = async () => {
      if (userID) {
        console.log("Fetching full user details for userID:", userID); // Log before fetching
        try {
          const response = await axios.get(`../../api/get_delivery_details?userId=${userID}`);
          console.log("Full user details response:", response); // Log the entire response
          console.log("Full user details response:", response.data); // Log the entire response
          setFullUserDetails(response.data);
        } catch (error) {
          console.error("Error fetching full user details:", error);
        }
      }
    };

    fetchFullUserDetails();
  }, [userID]);





  // delivery_address handler
  const handleDeliveryAddress = async (event) => {
    event.preventDefault();

    // Check zip code and phone number
    if (!/^[0-9]{6}$/.test(zipCode)) {
      setZipCodeError('Codul poștal trebuie să conțină exact 6 cifre');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setPhoneError('Numărul de telefon trebuie să conțină exact 10 cifre');
      return;
    }

    // Clear any existing errors
    setZipCodeError('');
    setPhoneError('');



    const combinedForm = {
      userID: userID,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      county: county,
      city: city,
      street: street,
      zip_code: zipCode,
    };

    try {
      await axios.post('../../api/account/delivery_addr', combinedForm);
      console.log("Personal and delivery information submitted successfully");
      setPopupText("Datele personale și adresa de livrare au fost actualizate cu succes!");
      setShowPopup(true);
    } catch (error) {
      console.error("Error submitting personal and delivery information:", error);
      setPopupText("A apărut o eroare la actualizarea datelor personale și a adresei de livrare.");
      setShowPopup(true);
    }
  };


  const handleBillingAddress = async (event) => {
    event.preventDefault();

    // Check if there are any errors
    if (billingEmailError || billingZipCodeError || billingPhoneError) {
      setPopupText("Vă rugăm să corectați erorile din formular înainte de a trimite.");
      setShowPopup(true);
      return;
    }

    const billingAddressForm = {
      email: fullUserDetails.email,
      invoiceType,
      billingFirstName,
      billingLastName,
      billingCounty,
      billingCity,
      billingStreet,
      billingZipCode,
      billingPhone,
      billingEmail,
      ...(invoiceType === 'company' ? {
        billingCompanyName,
        billingCUI,
      } : {
        billingCompanyName: null,
        billingCUI: null,
        billingRegCom: null,
      }),
    }

    console.log("Sending billing address data:", billingAddressForm);

    try {
      const response = await axios.post('../../api/account/billing_addr', billingAddressForm);
      console.log("Billing address response:", response);
      setPopupText("Adresa de facturare a fost actualizată cu succes!");
      setShowPopup(true);
    } catch (error) {
      console.error("Error submitting billing address:", error.response?.data || error.message);
      setPopupText("A apărut o eroare la actualizarea adresei de facturare.");
      setShowPopup(true);
    }
  };


  useEffect(() => {
    const fetchBillingDetails = async () => {
      if (userID) {
        console.log("Fetching billing details for userID:", userID);
        try {
          const response = await axios.get(`../../api/account/billing_addr?userId=${userID}`);
          console.log("Billing details response:", response);
          console.log("Billing details response data:", response.data);
          setFullBillingDetails(response.data);
          setInvoiceType(response.data.invoiceType || '');
        } catch (error) {
          console.error("Error fetching billing details:", error);
        }
      }
    };

    fetchBillingDetails();
  }, [userID]);



  const handleChangeEmail = async () => {
    const userEmailChange = {
      id: userID,
      email: email
    }

    try {
      const response = await axios.post("../../api/account/update_email", userEmailChange);
      if (response.status === 200) {
        setPopupText("Adresa de email a fost actualizată cu succes!");
        setShowPopup(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setPopupText("Această adresă de email este deja în uz. Te rugăm să alegi alta.");
      } else {
        setPopupText("A apărut o eroare la actualizarea adresei de email.");
      }
      setShowPopup(true);
      console.error("Error updating email address:", error);
    }
  }

  const handlePhoneChange = (event) => {
    const value = event.target.value.trim();
    setPhone(value);
    if (!/^[0-9]{10}$/.test(value)) {
      setPhoneError('Numărul de telefon trebuie să conțină exact 10 cifre');
    } else {
      setPhoneError('');
    }
  };


  const handleZipCodeChange = (event) => {
    const value = event.target.value;
    setZipCode(value);

    if (value.length === 6 && /^[0-9]{6}$/.test(value)) {
      setZipCodeError(''); // Clear the error when the zip code is valid
    } else {
      setZipCodeError('Codul poștal trebuie să conțină exact 6 cifre');
    }
  };

  const handleBillingPhoneChange = (event) => {
    const value = event.target.value.trim();
    setBillingPhone(value);
    if (!/^[0-9]{10}$/.test(value)) {
      setBillingPhoneError('Numărul de telefon trebuie să conțină exact 10 cifre');
    } else {
      setBillingPhoneError('');
    }
  };

  const handleBillingZipCodeChange = (event) => {
    const value = event.target.value;
    setBillingZipCode(value);

    if (value.length === 6 && /^[0-9]{6}$/.test(value)) {
      setBillingZipCodeError('');
    } else {
      setBillingZipCodeError('Codul poștal trebuie să conțină exact 6 cifre');
    }
  };

  const logout = async () => {
    try {
      await axios.get('../../api/auth/logout');
      window.location.reload();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  const handleBillingEmailChange = (event) => {
    const value = event.target.value.trim();
    setBillingEmail(value);

    function validateEmail(email) {
      const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@(?:gmail|yahoo|protonmail)\.com$/, "gm");
      return emailRegex.test(email);
    }

    if (validateEmail(value)) {
      setBillingEmailError('');
    } else {
      setBillingEmailError('Adresa de email invalidă.');
    }
  };

  // acc deletion + popup
  const handleAccountDeletion = async () => {
    setShowDeleteConfirmation(true);
  }

  const confirmAccountDeletion = async () => {
    const userToBeDeleted = {
      id: userID,
      email: fullUserDetails.email,
    }

    console.log(`userToBeDeleted: ${userToBeDeleted}`);

    try {
      const response = await axios.delete('../../api/account/delete_account', { data: userToBeDeleted });
      console.log("User deleted successfully", response.data);
      // Handle successful deletion (e.g., redirect to home page)
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      // Handle error (e.g., show error message to user)
    } finally {
      setShowDeleteConfirmation(false);
      window.location.reload();
    }
  }



  // const validateZipCode = (zipCode) => {
  //   const zipCodeRegex = /^\d{6}$/;
  //   return zipCodeRegex.test(zipCode);
  // };



  return (
    <div className="flex flex-col items-start mt-8 mx-8">
      {showPopup && (
        <PersonalDataConfirmationPopup
          text={popupText}
          onClose={() => setShowPopup(false)}
        />
      )}
      {showDeleteConfirmation && (
        <DeleteAccountConfirmationPopup
          onCancel={() => setShowDeleteConfirmation(false)}
          onConfirm={confirmAccountDeletion}
        />
      )}


      {/*ADRESA LIVRARE*/}
      <div className="mt-8 mb-4 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold">Adresă livrare</p>
          <button
            type="button"
            onClick={() => setShowDeliveryAddress(!showDeliveryAddress)}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-[#FFD700] hover:text-black transition duration-300 ease-in-out"
          >
            {showDeliveryAddress ? 'Ascunde' : 'Arată'}
          </button>
        </div>

        {showDeliveryAddress && (
          <DeliveryAddressForm
            fullUserDetails={fullUserDetails}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            phone={phone}
            setPhone={setPhone}
            handlePhoneChange={handlePhoneChange}
            phoneError={phoneError}
            county={county}
            setCounty={setCounty}
            city={city}
            setCity={setCity}
            street={street}
            setStreet={setStreet}
            zipCode={zipCode}
            setZipCode={setZipCode}
            handleZipCodeChange={handleZipCodeChange}
            zipCodeError={zipCodeError}
            handleDeliveryAddress={handleDeliveryAddress}
          />
        )}
      </div>


      {/* ADRESA DE FACTURARE */}
      <div className="mt-8 mb-4 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold">Adresă facturare</p>
          <div className="flex items-center">
            <div className="relative mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              {/* {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-sm rounded shadow-lg w-64 z-10">
                  Persoana juridica - adresa firmei pt facturare.
                  Persoana fizica - facturare pe alta adresa doar la plata online.
                </div>
              )} */}
            </div>
            <button
              type="button"
              onClick={() => setShowBillingAddress(!showBillingAddress)}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-[#FFD700] hover:text-black transition duration-300 ease-in-out"
            >
              {showBillingAddress ? 'Ascunde' : 'Arată'}
            </button>
          </div>
        </div>

        {showBillingAddress && (
          <form onSubmit={handleBillingAddress}>
            <div className="my-4">
              <p className="text-2xl font-sb mb-2">Tip Factură</p>
              <div>
                <select
                  id="invoice_type"
                  name="invoice_type"
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
                >
                  <option value="">Selectează tipul facturii</option>
                  <option value="personal">Persoană Fizică</option>
                  <option value="company">Persoană Juridică</option>
                </select>
              </div>
            </div>

            {invoiceType === 'company' && (
              <>
                <div className="my-4">
                  <p className="text-2xl font-sb mb-2">CUI</p>
                  <input
                    type="text"
                    placeholder={fullBillingDetails.billingCUI || "Introduceți Codul Unic de Înregistrare"}
                    value={billingCUI}
                    onChange={(e) => setBillingCUI(e.target.value)}
                    className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
                  />
                </div>

                <div className="my-4">
                  <p className="text-2xl font-sb mb-2">Nume Firmă</p>
                  <input
                    type="text"
                    placeholder={fullBillingDetails.billingCompanyName || "Introduceți numele firmei dumneavoastră"}
                    value={billingCompanyName}
                    onChange={(e) => setBillingCompanyName(e.target.value)}
                    className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out"
                  />
                </div>
              </>
            )}
            <BillingAddressForm
              firstName={billingFirstName}
              setFirstName={setBillingFirstName}
              lastName={billingLastName}
              setLastName={setBillingLastName}
              county={billingCounty}
              setCounty={setBillingCounty}
              city={billingCity}
              setCity={setBillingCity}
              zipCode={billingZipCode}
              handleZipCodeChange={handleBillingZipCodeChange}
              zipCodeError={billingZipCodeError}
              street={billingStreet}
              setStreet={setBillingStreet}
              phone={billingPhone}
              handlePhoneChange={handleBillingPhoneChange}
              phoneError={billingPhoneError}
              email={billingEmail}
              handleEmailChange={handleBillingEmailChange}
              emailError={billingEmailError}
              fullBillingDetails={fullBillingDetails}
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-md mt-2 hover:bg-[#FFD700] hover:text-black">
              Editează adresa de facturare
            </button>
          </form>
        )}
      </div>

      <div className="my-8">
        <p className="text-2xl font-bold mb-2">Schimbă email</p>
        <div className="flex flex-row border rounded-md px-4 py-2 w-full hover:border-black transition duration-300 ease-in-out">
          <input
            type="text"
            placeholder={fullUserDetails.email ? fullUserDetails.email : "Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
        </div>
        <button type="button" onClick={handleChangeEmail} className="bg-black text-white px-4 py-2 rounded-md mt-2 hover:bg-[#FFD700] hover:text-black">Schimba email</button>
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-sb mb-2">Acțiuni cont</h2>
        <div className="flex flex-col gap-4">
          <button onClick={logout} type="button" className="bg-black text-white px-4 py-2 rounded-md hover:bg-[#FFD700] hover:text-black">Logout</button>
          <button onClick={handleAccountDeletion} className="bg-red-500 text-white px-4 py-2 rounded-md hover:text-black hover:cursor-pointer">Șterge Contul</button>
        </div>
      </div>
    </div >
  );
}

export default PersonalData;
