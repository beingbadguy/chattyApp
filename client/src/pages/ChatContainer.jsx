import React, { useState } from "react";
import { useAuthStore } from "../Store.js/AuthStore";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { formatDistanceToNowStrict } from "date-fns";

const ChatContainer = () => {
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
    bgcolor,
  } = useAuthStore();

  const [text, setTextData] = useState("");
  const formatCreatedAt = (createdAt) => {
    return formatDistanceToNowStrict(new Date(createdAt)); // Use date-fns
  };

  return (
    <div>
      <div className=" w-full h-screen">
        {selectedUser ? (
          <div>
            <div className="flex items-center gap-2 px-4 bg-gray-200 p-2 cursor-pointer">
              <MdKeyboardArrowLeft
                className="size-8"
                onClick={() => {
                  selectUser(null);
                }}
              />
              <div className="relative">
                <img
                  src={
                    selectedUser?.profilePic ||
                    "https://img.icons8.com/?size=100&id=2yC9SZKcXDdX&format=png&color=000000"
                  }
                  alt="logo"
                  className="size-10 object-cover bg-black rounded-full relative"
                />
                <div
                  className={`${
                    selectedUser && onlineUsers.includes(selectedUser?._id)
                      ? "bg-green-500"
                      : "bg-red-400"
                  } size-2 rounded-full absolute top-1 right-0`}
                ></div>
              </div>

              {selectedUser?.name}
            </div>
            <div
              id="chatContainer"
              className="min-h-[500px] max-h-[600px]    md:min-h-[490px] lg:min-h-[500px] lg:h-[570px] overflow-y-scroll "
            >
              {message?.length > 0 ? (
                message.map((msg) => (
                  <div
                    key={msg?._id}
                    className={`flex  mt-2 ${
                      msg.senderId === authUser?._id
                        ? "justify-end"
                        : "justify-start"
                    } mx-2`}
                  >
                    <div
                      className={` ${
                        msg.senderId != authUser?._id ? "flex-row-reverse" : ""
                      } flex gap-1 items-center`}
                    >
                      <div>
                        <span className="text-gray-500 text-xs ml-2">
                          {formatCreatedAt(msg.createdAt)} ago
                        </span>
                        <p
                          className={`${
                            msg.senderId === authUser?._id
                              ? `bg-[${bgcolor}] text-white`
                              : "bg-gray-300 text-black"
                          } w-auto max-w-xs lg:max-w-sm px-4 py-2 rounded-lg mb-2`}
                        >
                          {msg.text}
                        </p>
                      </div>
                      <div>
                        <img
                          src={
                            msg.senderId === authUser?._id
                              ? authUser?.profilePic
                              : `${selectedUser?.profilePic} `
                          }
                          alt=""
                          className="object-contain border border-black size-10 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center mt-4 text-gray-500">
                  No messages to display.
                </div>
              )}
            </div>
            <div className="flex items-center justify-center bg-gray-100 mb-1 py-4 gap-4 fixed w-full">
              <input
                type="text"
                value={text}
                className="border border-gray-400 rounded w-[50%] p-2 outline-none"
                onChange={(e) => {
                  setTextData(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text) {
                    sendMessage(text);
                    setTextData("");
                  }
                }}
              />
              <button
                className={` bg-[${bgcolor}] hover:bg-[${bgcolor}] transition-all duration-200 p-2 rounded flex items-center justify-center gap-2 text-white`}
                onClick={() => {
                  if (text) {
                    sendMessage(text);
                    setTextData("");
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    if (text) {
                      sendMessage(text);
                      setTextData("");
                    }
                  }
                }}
              >
                <BsSend />
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="md:flex items-center justify-center w-full flex-col gap-4 hidden h-screen">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((e, i) => (
                <p
                  key={Math.random()}
                  className={`${
                    i % 2 !== 0
                      ? `bg-[${bgcolor}] transition-all duration-300 animate-pulse`
                      : ""
                  } size-20 bg-[${bgcolor}]`}
                ></p>
              ))}
            </div>
            <p className="text-md">Join the very secretive chat website</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
