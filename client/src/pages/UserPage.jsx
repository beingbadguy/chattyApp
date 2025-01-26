import React, { useEffect, useState } from "react";
import { useAuthStore } from "../Store.js/AuthStore";
import { useNavigate } from "react-router-dom";
import ChatContainer from "./ChatContainer";
import { RiMessage3Fill } from "react-icons/ri";

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
  } = useAuthStore();
  const navigate = useNavigate();
  const [text, setTextData] = useState("");

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
          className={` bg-gray-100 h-[700px] ${
            selectedUser != null ? "hidden md:flex" : "w-full"
          } md:w-[20%] flex flex-col justify-between`}
        >
          <div
            className={`${selectedUser != null ? "hidden md:block" : "w-full"}`}
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
                  <div className="size-10 bg-black rounded-full relative">
                    <div
                      className={`${
                        onlineUsers.includes(user?._id) ? "bg-green-500" : ""
                      } size-2 rounded-full absolute top-1 right-0`}
                    ></div>
                  </div>
                  <p className="flex  items-center gap-1 justify-between w-full md:w-[80%] lg:w-[80%]  ">
                    {user?.name}
                    <RiMessage3Fill
                      className={`${
                        onlineUsers.includes(user?._id) ? "text-green-500" : ""
                      } size-5 `}
                    />
                  </p>
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
