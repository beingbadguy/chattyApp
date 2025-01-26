import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../Store.js/AuthStore";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ProfilePage = () => {
  const {
    logout,
    authUser,
    checkAuth,
    changeBg,
    bgcolor,
    uploadProfilePic,
    isProfileUpdating,
  } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref for the file input

  useEffect(() => {
    checkAuth();
  }, []);

  // Function to handle camera icon click
  const handleCameraClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  if (isProfileUpdating)
    return (
      <div className="flex items-center justify-center h-screen">
        <AiOutlineLoading3Quarters
          className={`text-[${bgcolor}] animate-spin size-6`}
        />
      </div>
    );

  return (
    <div className="flex items-center flex-col">
      <div className="w-full">
        <h1 className="text-2xl text-center font-bold mt-2">Profile</h1>

        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="px-4 mt-2 text-blue-700 flex items-center gap-1"
          >
            <IoIosArrowBack />
            Go Back
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-4 mt-2 text-red-700 flex items-center gap-1"
          >
            <RiLogoutCircleRLine />
            Logout
          </button>
        </div>
      </div>
      <div
        className={`flex items-center justify-center flex-col gap-2 mt-6 p-4 w-[90%] md:w-[40%] bg-gray-100 rounded`}
      >
        <p>Your profile information</p>
        <div className="relative">
          <img
            src={
              authUser?.profilePic ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="profile"
            className="rounded-full w-32 h-32 object-cover mt-2"
          />
          <IoCameraOutline
            onClick={handleCameraClick} // Trigger file input on click
            className={`absolute top-[75%] right-1 size-8 bg-[${bgcolor}] rounded-full p-1 cursor-pointer`}
          />
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                console.log("Selected file:", file);
                uploadProfilePic(file);
              }
            }}
            style={{ display: "none" }} // Hide the file input
          />
        </div>
        <p>Click the camera icon to change your photo</p>
        <div className="flex items-center flex-col mt-4 w-full">
          <div className="w-full">
            <p className="flex items-center gap-2 text-black">
              <FaRegUser />
              Full Name
            </p>
            <h2 className="w-full rounded p-2 border-2 border-black my-2">
              {authUser?.name}
            </h2>
          </div>
          <div className="w-full">
            <p className="flex items-center gap-2 text-black">
              <MdOutlineAlternateEmail /> Email Address
            </p>
            <h2 className="w-full rounded p-2 border-2 border-black my-2">
              {authUser?.email}
            </h2>
          </div>
        </div>
        <div className="text-right">
          <p>
            Account Status: <span className="text-green-500">Active</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
