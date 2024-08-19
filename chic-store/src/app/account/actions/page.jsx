'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { PersonalDataConfirmationPopup } from "@/components/PersonalDataConfirmationPopup";
import { DeleteAccountConfirmationPopup } from "@/components/DeleteAccountConfirmationPopup";


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



const Actions = () => {
  const [userID, setUserID] = useState('');
  const [email, setEmail] = useState('');
  const [fullUserDetails, setFullUserDetails] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

  useEffect(() => {
    const fetchFullUserDetails = async () => {
      if (userID) {
        try {
          const response = await axios.get(`../../api/get_delivery_details?userId=${userID}`);
          setFullUserDetails(response.data);
        } catch (error) {
          console.error("Error fetching full user details:", error);
        }
      }
    };

    fetchFullUserDetails();
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

  const logout = async () => {
    try {
      await axios.get('../../api/auth/logout');
      window.location.reload();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

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
      <div className="my-8">
        <p className="text-2xl font-semibold mb-2">Schimbă email</p>
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
        <h2 className="text-2xl font-semibold mb-2">Acțiuni cont</h2>
        <div className="flex flex-col gap-4">
          <button onClick={logout} type="button" className="bg-black text-white px-4 py-2 rounded-md hover:bg-[#FFD700] hover:text-black">Logout</button>
          <button onClick={handleAccountDeletion} className="bg-red-500 text-white px-4 py-2 rounded-md hover:text-black hover:cursor-pointer">Șterge Contul</button>
        </div>
      </div>
    </div>
  );
}

export default Actions;