import React, { useEffect, useState } from "react";
import { useAuthStore } from "../Store.js/AuthStore";
import { useNavigate } from "react-router-dom";
import ChatContainer from "./ChatContainer";
import { RiMessage3Fill } from "react-icons/ri";
import userImage from "../../public/user.png";
import { CiWifiOff } from "react-icons/ci";
import { CiWifiOn } from "react-icons/ci";
import { LuMessageCircleDashed } from "react-icons/lu";

const UserPage = () => {
  const {
    authUser,
    onlineUsers,
    allUsers,
    selectUser,
    selectedUser,
    getMessages,
    sendMessage,
    message,
    subscribeToMessage,
    unsubscribeFromMessages,
    isUserTyping,
    handleTyping,
    usersThatAreTyping,
    userThatReceivedMessage,
  } = useAuthStore();
  const navigate = useNavigate();
  const [text, setTextData] = useState("");
  console.log(userThatReceivedMessage);

  useEffect(() => {});

  // Redirect if not logged in
  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  // Scroll to the bottom of chat when message updates
  useEffect(() => {
    const chatContainer = document.querySelector("#chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [message]);

  // Subscribe/unsubscribe to new messages on selectedUser change
  useEffect(() => {
    if (selectedUser) {
      const unsubscribe = subscribeToMessage();
      return () => {
        unsubscribe(); // Cleanup on component unmount
      };
    }
  }, [selectedUser, subscribeToMessage]);

  // Ensure user is selected before trying to fetch messages

  const handleUserClick = (user) => {
    selectUser(user);
    getMessages(user._id); // Fetch messages of the selected user
  };

  return (
    <div>
      <div className="flex items-start">
        <div
          className={` bg-gray-100 ${
            selectedUser != null ? "hidden md:flex" : "w-full"
          } md:w-[30%] lg:w-[20%] flex flex-col `}
        >
          <div className="flex p-4 justify-between items-center border-b py-2 border-gray-300">
            Users to chat <RiMessage3Fill />
          </div>
          <div
            id="users"
            className={`users ${
              selectedUser != null ? "hidden md:block" : "w-full"
            } mt-1 h-[700px] overflow-y-scroll`}
          >
            {allUsers &&
              allUsers.map((user) => (
                <div
                  key={user?._id}
                  className={`${
                    selectedUser?._id === user?._id ? "bg-gray-200" : ""
                  } flex items-center gap-2  hover:bg-gray-200 p-2 cursor-pointer`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="relative">
                    <img
                      src={user?.profilePic || userImage}
                      alt={user?.name}
                      className="object-cover w-10 h-10 rounded-full border-black border"
                    />
                    <div
                      className={`${
                        onlineUsers.includes(user?._id) ? "bg-green-500" : ""
                      } size-2 rounded-full absolute top-1 right-0`}
                    ></div>
                  </div>
                  {/* {userThatReceivedMessage.includes(user?._id) && (
                    <p className="text-sm text-gray-400">New Message</p>
                  )} */}
                  <div className="flex  items-center gap-1 justify-between w-full md:w-[80%] lg:w-[80%]  ">
                    <div>
                      {user?.name}
                      {usersThatAreTyping.includes(user?._id) && (
                        <p className="text-sm text-gray-400">is Typing...</p>
                      )}
                    </div>

                    {onlineUsers.includes(user?._id) ? (
                      <CiWifiOn className="size-6  text-green-600" />
                    ) : (
                      <CiWifiOff className="size-6  text-red-600" />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div
          className={`${
            selectedUser != null ? "w-full" : "hidden md:block md:w-full"
          }`}
        >
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
