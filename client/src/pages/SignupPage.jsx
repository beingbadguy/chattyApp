import React, { useEffect, useState } from "react";
import { useAuthStore } from "../Store.js/AuthStore";
import { RiLoader5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { SiImessage } from "react-icons/si";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { PiPasswordThin } from "react-icons/pi";
import { MdAlternateEmail } from "react-icons/md";
import { FiUser } from "react-icons/fi";

const SignupPage = () => {
  const {
    authUser,
    signup,
    AnyError,
    isSigningUp,
    checkAuth,
    isAuthChecking,
    getAllUsers,
    bgcolor,
  } = useAuthStore();
  console.log(authUser);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const signupHandler = (e) => {
    e.preventDefault();
    if (!userData.email || !userData.password || !userData.name) {
      setError("Please Provide Name, email and password");
      return;
    }
    if (userData.password.length < 6) {
      setError("Password length must be greater than 6");
      return;
    }
    signup(userData, navigate);
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
        <div className="flex items-center justify-center flex-col h-full w-full   border-t-0 border ">
          <div
            className={`text-xl my-4 font-bold text-[${bgcolor}] flex items-center flex-col gap-1`}
          >
            <div>
              <SiImessage className="size-10" />
            </div>
            <div>Welcome Back</div>
            <div className="text-sm opacity-75">Create your account</div>
          </div>
          <div className="w-full">
            <form
              onSubmit={(e) => {
                signupHandler(e);
              }}
              className="flex items-center justify-center flex-col  w-full"
            >
              <div
                className={`border border-[${bgcolor}]  my-4 w-[80%] md:w-[70%] rounded outline-[${bgcolor}] flex items-center gap-1`}
              >
                <FiUser className={` ml-2  text-[${bgcolor}]   text-lg`} />
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  placeholder="Name"
                  onChange={handleChange}
                  className="w-full p-2 outline-none rounded"
                />
              </div>
              <div
                className={`border border-[${bgcolor}]  my-4 w-[80%] md:w-[70%] rounded outline-[${bgcolor}] flex items-center gap-1`}
              >
                <MdAlternateEmail
                  className={` ml-2  text-[${bgcolor}]   text-lg`}
                />
                <input
                  type="text"
                  name="email"
                  value={userData.email}
                  placeholder="Email"
                  onChange={handleChange}
                  className="w-full p-2 outline-none rounded"
                />
              </div>
              <div
                className={`border border-[${bgcolor}]  my-4 w-[80%] md:w-[70%] rounded outline-[${bgcolor}] flex items-center gap-1 relative`}
              >
                <PiPasswordThin
                  className={` ml-2  text-[${bgcolor}]   text-lg`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userData.password}
                  placeholder="Password"
                  className="w-full p-2 outline-none rounded"
                  onChange={handleChange}
                />

                <div className="absolute right-3 text-gray-400 cursor-pointer">
                  {showPassword ? (
                    <HiOutlineEye
                      className={`   text-[${bgcolor}]   text-lg`}
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  ) : (
                    <HiOutlineEyeOff
                      className={`   text-[${bgcolor}]   text-lg`}
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  )}
                </div>
              </div>

              <button
                className={`p-2 mt-4 bg-[${bgcolor}]  text-white w-[80%] md:w-[70%] rounded`}
              >
                {isSigningUp ? (
                  <div className="flex items-center justify-center animate-spin">
                    <RiLoader5Fill />
                  </div>
                ) : (
                  "Signup"
                )}
              </button>
              <p className=" text-right  text-black mt-2">
                Already have an Account ?{" "}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Login
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
                    ? `bg-[${bgcolor}] transition-all duration-300 animate-pulse`
                    : ""
                } size-20 bg-[${bgcolor}]`}
              ></p>
            ))}
          </div>
          <p className="text-md">Join the very secretive chat website</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
