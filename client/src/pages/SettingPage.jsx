import React, { useEffect, useState } from "react";
import { useAuthStore } from "../Store.js/AuthStore";
import { useNavigate } from "react-router-dom";

const SettingPage = () => {
  const { logout, authUser, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  console.log(authUser);

  return (
    <div>
      <p
        className="text-white bg-black  mt-2 p-2 text-center rounded"
        onClick={() => {
          logout(navigate);
        }}
      >
        Logout
      </p>
    </div>
  );
};

export default SettingPage;
