import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store.js/AuthStore";
import { BsChatHeart } from "react-icons/bs";
import { SiImessage } from "react-icons/si";
import { CiSettings } from "react-icons/ci";
import { FaRegUser, FaUser } from "react-icons/fa6";

const Layout = () => {
  const { authUser, checkAuth, bgcolor } = useAuthStore();
  // useEffect(() => {
  //   checkAuth();
  //   console.log("Layout is now initialized");
  // }, []);
  const navigate = useNavigate();
  return (
    <div>
      <nav className="p-2 flex justify-between items-center shadow-sm">
        <h1
          className={`text-2xl font-bold text-[${bgcolor}]  animate-pulse flex gap-2 items-center cursor-pointer `}
          onClick={() => {
            navigate("/");
          }}
        >
          <SiImessage />
          Chatty
        </h1>
        <ul className="flex items-center gap-2 text-white">
          {/* <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li> */}

          {authUser ? (
            <ul className="flex gap-4 items-center justify-center">
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center justify-center gap-1 p-2 rounded bg-[${bgcolor}]`}
                >
                  <p className="hidden md:block">{authUser?.name} </p>
                  <FaRegUser className="text-md" />
                </Link>
              </li>
            </ul>
          ) : (
            ""
          )}
          <li>
            <Link
              to="/setting"
              className={`flex items-center justify-center gap-1 p-2 rounded bg-[${bgcolor}]`}
            >
              <p className="hidden md:block">Setting </p>
              <CiSettings className="text-lg" />
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
