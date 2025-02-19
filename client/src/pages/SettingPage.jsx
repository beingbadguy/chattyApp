import React, { useEffect, useState } from "react";
import { useAuthStore } from "../Store.js/AuthStore";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoMdArrowDropleft } from "react-icons/io";

const SettingPage = () => {
  const { logout, authUser, checkAuth, changeBg } = useAuthStore();
  const navigate = useNavigate();

  const bgColors = [
    "#FF6384",
    "#36A2EB",
    "#4CAF50",
    "#F79F1F",
    "#E91E63",
    "#9C27B0",
    "#43A047",
    "#673AB7",
    "#3F51B5",
    "#795548",
    "#9E9E9E",
    "#607D8B",
    "#2196F3",
    "#00BCD4",
    "#009688",
    "#CDDC39",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#84a98c",
    "#FF0035",
    "#0E131F",
    "#495F41",
    "#1A936F",
    "#303A2B",
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <div className="w-full">
        <h1 className="text-2xl text-center font-bold mt-2">Settings</h1>

        <button
          onClick={() => window.history.back()}
          className=" px-4 mt-2 text-blue-700 flex items-center gap-1"
        >
          <IoIosArrowBack />
          Go Back
        </button>
      </div>
      <div className="flex items-center justify-start gap-10 flex-wrap  p-5 overflow-y-scroll h-auto">
        {bgColors?.map((clr) => (
          <div
            key={Math.random()}
            className={`bg-[${clr}] rounded-full size-14 md:size-20 cursor-pointer flex items-center justify-center text-sm`}
            onClick={() => {
              changeBg(clr);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SettingPage;
