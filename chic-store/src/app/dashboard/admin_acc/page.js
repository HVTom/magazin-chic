'use client';
import React from "react";
import axios from "axios";

const AdminAcc = () => {

  const logout = async () => {
    try {
      await axios.get('../../api/auth/logout');
      console.log("Logout successful");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <div className="flex flex-col items-start mt-8 mx-8">
      <div className="my-8">
        <h2 className="text-2xl font-sb mb-2">Acțiuni cont</h2>
        <div className="flex flex-col gap-4">
          <button onClick={logout} type="button" className="bg-black text-white px-4 py-2 rounded-md hover:bg-red-500 hover:text-black">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAcc;
