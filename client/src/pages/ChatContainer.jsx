import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../Store.js/AuthStore";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { formatDistanceToNowStrict } from "date-fns";
import { TiMessageTyping } from "react-icons/ti";
import { GiCaterpillar } from "react-icons/gi";
import { LuImagePlus, LuMessageCircleDashed } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import userImage from "../../public/user.png";
import { BiMailSend } from "react-icons/bi";
const ChatContainer = () => {
  const chatContainerRef = useRef(null);
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
    isUserTyping,
    handleTyping,
    socket,
    setIsUserTyping,
    setUserTyping,
    stopUserTyping,
    isMediaSending,
  } = useAuthStore();

  const [text, setTextData] = useState("");
  const [media, setMedia] = useState("");
  const [photo, setPhoto] = useState(null);
  const formatCreatedAt = (createdAt) => {
    return formatDistanceToNowStrict(new Date(createdAt)); // Use date-fns
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [message, isUserTyping]);

  useEffect(() => {
    // Check for socket and selectedUser availability
    if (!socket) {
      // console.log("Socket is not initialized or selected user is not set");
      return;
    }

    // console.log("Socket is initialized in chatContainer");

    // Add socket event listeners
    socket.on("typing", (senderId) => {
      // console.log(senderId);
      setUserTyping(senderId);
      // console.log(`${senderId} is typing`);
      if (senderId === selectedUser?._id) {
        setIsUserTyping(true); // Update state only for the selected user
      }
    });

    socket.on("stopTyping", (senderId) => {
      // console.log(`${senderId} stopped typing`);
      stopUserTyping(senderId);
      if (senderId === selectedUser?._id) {
        setIsUserTyping(false); // Update state only for the selected user
      }
    });

    // Cleanup socket event listeners on unmount
    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const unsubscribe = subscribeToMessage();
      return () => {
        unsubscribe(); // Cleanup on component unmount
      };
    }
  }, [selectedUser, subscribeToMessage]);

  // Scroll to the bottom whenever the photo state is null
  useEffect(() => {
    if (!photo && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        // behavior: "smooth",
      });
    }
  }, [photo]);

  // console.log(chatContainerRef?.current?.scrollHeight);

  // console.log(media);
  if (photo) {
    return (
      <div className="flex justify-center items-center  h-screen">
        <div className="relative bg-gray-100 mx-10 rounded flex items-center justify-center">
          <img src={photo} alt="" className="h-[400px] w-full rounded" />
          <p
            className={`absolute bg-[${bgcolor}] p-2 rounded-full size-8 flex items-center justify-center text-white -top-1 -right-2`}
            onClick={() => {
              setPhoto(null);
            }}
          >
            <IoCloseOutline />
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className=" w-full h-screen  ">
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
                  src={selectedUser?.profilePic || userImage}
                  alt="logo"
                  className="size-10 object-cover border border-black  rounded-full relative"
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
              ref={chatContainerRef}
              className="min-h-[500px] max-h-[560px]    md:min-h-[490px] lg:min-h-[500px] lg:h-[570px] overflow-y-scroll relative "
            >
              {isMediaSending ? (
                <div className="flex justify-center items-center h-screen">
                  <BiMailSend
                    className={` text-[${bgcolor}] animate-bounce text-3xl`}
                  />
                </div>
              ) : (
                <div>
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
                            msg.senderId != authUser?._id
                              ? "flex-row-reverse"
                              : ""
                          } flex gap-1 items-center`}
                        >
                          <div>
                            <span className="text-gray-500 text-xs ml-2">
                              {formatCreatedAt(msg.createdAt)} ago
                            </span>
                            {msg?.text ? (
                              <p
                                className={`${
                                  msg.senderId === authUser?._id
                                    ? `bg-[${bgcolor}] text-white`
                                    : "bg-gray-300 text-black"
                                } w-auto max-w-xs lg:max-w-sm px-4 py-2 rounded-lg mb-2`}
                              >
                                {msg.text}
                              </p>
                            ) : (
                              ""
                            )}
                            {msg?.media ? (
                              <img
                                src={msg.media}
                                alt=""
                                className="size-20"
                                onClick={() => {
                                  setPhoto(msg.media);
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <div>
                            <img
                              src={
                                msg.senderId === authUser?._id
                                  ? authUser?.profilePic || userImage
                                  : `${selectedUser?.profilePic || userImage} `
                              }
                              alt=""
                              className="object-cover border border-black size-10 rounded-full"
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
                  {isUserTyping ? (
                    <div className={` flex items-center mx-2`}>
                      <img
                        src={
                          selectedUser?.profilePic ||
                          "https://img.icons8.com/?size=100&id=7820&format=png&color=000000"
                        }
                        alt=""
                        className="object-cover border border-black size-8 rounded-full"
                      />
                      <p className="text-black text-sm  animate-pulse ml-3">
                        {" "}
                        {selectedUser?.name} is typing ...
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center bg-gray-100 mb-1 py-4 gap-4 fixed w-full ">
              <div>
                {media ? (
                  <div className="absolute -top-[100px] left-[0%] w-full h-[100px] overflow-hidden bg-gray-200 flex items-center justify-center ">
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(media)}
                        alt="media"
                        className="h-[90px]"
                      />
                      <button
                        className={` bg-[${bgcolor}] hover:scale-105 transition-all duration-200   text-white  size-5 rounded-full flex items-center justify-center absolute -top-1 -right-2 z-[999]`}
                        onClick={() => {
                          setMedia(null);

                          if (media) {
                            URL.revokeObjectURL(media);
                          }
                        }}
                      >
                        <IoCloseOutline className="text-xl " />
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <input
                  type="file"
                  name=""
                  id=""
                  className="w-5 absolute z-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (media) {
                      URL.revokeObjectURL(media);
                      setMedia(null);
                    }
                    setMedia(e.target.files[0]);
                  }}
                />
                <LuImagePlus
                  className={` text-[${bgcolor}] z-[99] size-6 cursor-pointer`}
                />
              </div>
              <input
                type="text"
                value={text}
                className="border border-gray-400 rounded w-[50%] p-2 outline-none"
                onChange={(e) => {
                  setTextData(e.target.value);
                  handleTyping(selectedUser?._id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text) {
                    sendMessage(text, media);
                    setTextData("");
                    setMedia(null);
                    URL.revokeObjectURL(media);
                  }
                }}
              />
              <button
                className={` bg-[${bgcolor}] hover:bg-[${bgcolor}] transition-all duration-200 p-2 rounded flex items-center justify-center gap-2 text-white`}
                onClick={() => {
                  if (text) {
                    sendMessage(text);
                    setTextData("");
                    URL.revokeObjectURL(media);
                    setMedia(null);
                  }
                  if (media) {
                    sendMessage(text, media);
                    setMedia(null);
                    URL.revokeObjectURL(media);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    if (text) {
                      sendMessage(text);
                      setTextData("");
                      URL.revokeObjectURL(media);
                    }
                    if (media) {
                      sendMessage(text, media);
                      setMedia(null);
                      URL.revokeObjectURL(media);
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
