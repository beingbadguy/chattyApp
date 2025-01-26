import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../Store.js/AuthStore";

const Layout = () => {
  const { authUser, checkAuth } = useAuthStore();
  // useEffect(() => {
  //   checkAuth();
  //   console.log("Layout is now initialized");
  // }, []);
  return (
    <div>
      <nav className="p-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-500 animate-pulse">
          Chatty
        </h1>
        <ul className="flex items-center gap-8">
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
            <ul className="flex gap-8 items-center justify-center">
              <li>
                <p>{authUser?.name}</p>
              </li>
              <li>
                <Link to="/setting">Setting</Link>
              </li>
            </ul>
          ) : (
            ""
          )}
        </ul>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
