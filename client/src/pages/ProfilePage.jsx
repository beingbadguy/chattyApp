import React, { useEffect, useState } from "react";
import { useAuthStore } from "../Store.js/AuthStore";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoMdArrowDropleft } from "react-icons/io";
import { RiLogoutCircleRLine } from "react-icons/ri";

const ProfilePage = () => {
  const { logout, authUser, checkAuth, changeBg } = useAuthStore();
  const navigate = useNavigate();
  console.log(authUser);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <div className="w-full">
        <h1 className="text-2xl text-center font-bold mt-2">User</h1>

        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className=" px-4 mt-2 text-blue-700 flex items-center gap-1"
          >
            <IoIosArrowBack />
            Go Back
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className=" px-4 mt-2 text-red-700 flex items-center gap-1"
          >
            <RiLogoutCircleRLine />
            Logout
          </button>
        </div>
      </div>
      <div className="flex items-center flex-col gap-2 mt-6">
        <div>
          <img
            src={
              authUser?.profile ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="profile"
            className="rounded-full w-20 h-20 object-cover"
          />
        </div>
        <div className="flex items-center flex-col mt-4">
          <h2>{authUser?.name}</h2>
          <p>{authUser?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
