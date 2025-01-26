import React, { useEffect, useState } from "react";
import { useAuthStore } from "./Store.js/AuthStore";
import { RiLoader5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const App = () => {
  const {
    authUser,
    login,
    AnyError,
    isLoggingIn,
    checkAuth,
    isAuthChecking,
    getAllUsers,
  } = useAuthStore();
  // console.log(authUser);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const LoginHandler = (e) => {
    e.preventDefault();
    if (!userData.email || !userData.password) {
      setError("Please Provide both email and password");
      return;
    }
    if (userData.password.length < 6) {
      setError("Password length must be greater than 6");
      return;
    }
    login(userData, navigate);
    setError("");
  };

  useEffect(() => {
    checkAuth();
    getAllUsers();
    if (authUser) {
      navigate("/user");
      console.log("i have changed");
    }
  }, [authUser]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen  flex items-center justify-center animate-spin">
        <RiLoader5Fill />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex items-center justify-center gap-1 w-full">
        {/* left  */}
        <div className="flex items-center justify-center flex-col h-full w-full   border-t-0 border">
          <p className="text-xl my-4 font-bold text-green-500">Login</p>
          <div className="w-full">
            <form
              onSubmit={(e) => {
                LoginHandler(e);
              }}
              className="flex items-center justify-center flex-col  w-full"
            >
              <input
                type="text"
                name="email"
                value={userData.email}
                placeholder="Email"
                className="border p-2 my-4 w-[80%] md:w-[70%] rounded outline-green-500"
                onChange={handleChange}
              />
              <input
                type="text"
                name="password"
                value={userData.password}
                placeholder="password"
                className="border p-2  w-[80%] md:w-[70%] rounded outline-green-500"
                onChange={handleChange}
              />

              <button className="p-2 mt-4 bg-green-500 text-white w-[80%] md:w-[70%] rounded">
                {isLoggingIn ? (
                  <div className="flex items-center justify-center animate-spin">
                    <RiLoader5Fill />
                  </div>
                ) : (
                  "Login"
                )}
              </button>
              <p className=" text-right  text-black mt-2">
                Don't Have an Account ?{" "}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Signup
                </span>
              </p>
              <p className=" text-center text-red-700 mt-1">{AnyError}</p>
              <p className="text-red-700 text-center mt-1">{error}</p>
            </form>
          </div>
        </div>
        {/* right  */}
        <div className="md:flex items-center justify-center w-full flex-col gap-4 hidden">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((e, i) => (
              <p
                key={Math.random()}
                className={` ${
                  i % 2 != 0
                    ? "bg-[#2dc653] transition-all duration-300 animate-pulse"
                    : ""
                } size-20 bg-[#2dc653]`}
              ></p>
            ))}
          </div>
          <p className="text-md">Join the very secretive chat website</p>
        </div>
      </div>
    </div>
  );
};

export default App;
