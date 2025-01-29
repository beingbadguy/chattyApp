import { create } from "zustand";
import axiosInstance from "../axiosInstance";
import { io } from "socket.io-client";

// const BASE_URL = "https://chattyapp-gy71.onrender.com";
const BASE_URL = "http://localhost:8000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isAuthChecking: false,
  isLoggingIn: false,
  isSigningUp: false,
  AnyError: null,
  socket: null,
  onlineUsers: [],
  allUsers: [],
  selectedUser: null,
  message: [],
  isMediaSending: false,
  isProfileUpdating: false,
  isUserTyping: false,
  typingTimeout: null,
  userThatReceivedMessage: [],
  setUserMessages: (user) => {
    const { userThatReceivedMessage } = get();
    if (!userThatReceivedMessage.includes(user)) {
      set({ userThatReceivedMessage: [...userThatReceivedMessage, user] });
    }
  },
  usersThatAreTyping: [],
  setUserTyping: (user) => {
    const { usersThatAreTyping } = get();
    if (!usersThatAreTyping.includes(user)) {
      set({ usersThatAreTyping: [...usersThatAreTyping, user] });
    }
  },

  stopUserTyping: (user) => {
    const { usersThatAreTyping } = get();
    set({ usersThatAreTyping: usersThatAreTyping.filter((u) => u !== user) });
  },

  bgcolor: localStorage.getItem("bgcolor") || "#2dc653", // Initialize with saved color or default
  changeBg: (color) => {
    set({ bgcolor: color });
    localStorage.setItem("bgcolor", color); // Save the new color
  },

  login: async (data, navigate) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/api/auth/login", data);
      get().getAllUsers();
      set({ isLoggingIn: false, authUser: res.data.data, AnyError: null });
      get().connectSocket();
      navigate("/user");
    } catch (error) {
      console.log(error.response?.data?.message);
      set({
        isLoggingIn: false,
        AnyError: error.response?.data?.message || "Something went wrong",
      });
    }
  },
  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/api/auth/signup", data);
      get().getAllUsers();
      set({ isSigningUp: false, authUser: res.data.data, AnyError: null });
      get().connectSocket();

      navigate("/user");
    } catch (error) {
      console.log(error.response?.data?.message);
      set({
        isSigningUp: false,
        AnyError: error.response?.data?.message || "Something went wrong",
      });
    }
  },
  logout: async (navigate) => {
    const res = await axiosInstance.post("/api/auth/logout");
    get().disconnectSocket();
    set({ authUser: null });
    set({ socket: null });
    set({ allUsers: [] });
  },
  checkAuth: async () => {
    try {
      set({ isAuthChecking: true });
      const res = await axiosInstance.get("/api/auth/verify");
      get().getAllUsers();
      get().connectSocket();
      set({ isAuthChecking: false, authUser: res.data.data, AnyError: null });
    } catch (error) {
      console.log(error.response?.data?.message);
      set({
        isAuthChecking: false,
        AnyError: error.response?.data?.message || "Something went wrong",
      });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    newSocket.connect();
    set({ socket: newSocket });
    newSocket.on("getOnlineUsers", (userIDs) => {
      set({ onlineUsers: userIDs });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  getAllUsers: async () => {
    try {
      const res = await axiosInstance.get("/api/user/allusers");
      set({ allUsers: res.data.data });
      // console.log(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  },
  selectUser: (user) => {
    set({ selectedUser: user });
    get().subscribeToMessage();
  },
  sendMessage: async (text, media) => {
    const { selectedUser, message } = get();
    try {
      const formData = new FormData();
      formData.append("media", media);
      formData.append("text", text);
      if (media || (media && text)) {
        set({ isMediaSending: true });
      }
      const res = await axiosInstance.post(
        `/api/message/send/${selectedUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(res.data);
      if (media || (media && text)) {
        set({ isMediaSending: false });
      }

      set({ message: [...message, res.data] });
    } catch (error) {
      console.log(error.message);
      console.log(error?.response?.data);
      set({ isMediaSending: false });
    }
  },
  getMessages: async (userId) => {
    try {
      const res = await axiosInstance.get(`/api/message/messages/${userId}`);
      set({ message: res.data });
    } catch (error) {
      console.log(error.message);
      console.log(error?.response?.data);
    }
  },

  subscribeToMessage: () => {
    const { selectedUser, socket, authUser, isUserTyping, setUserMessages } =
      get();

    if (!socket) {
      console.error("Socket instance is not initialized.");
      return;
    }

    // if (!selectedUser) {
    //   console.log("No user selected.");
    //   return;
    // }

    // Clean up any existing listener to avoid duplicates
    socket.off("newMessage");

    const handleNewMessage = (newMessage) => {
      // console.log("Received newMessage:", newMessage);
      // Update the typing status
      setUserMessages(newMessage.senderId);

      // Check if the new message is relevant
      const isMessageRelevant =
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === authUser?._id;

      if (!isMessageRelevant) return;

      set((state) => ({
        message: [...state.message, newMessage],
      }));
    };

    // Register new listener
    socket.on("newMessage", handleNewMessage);

    // console.log(
    //   "Subscribed to newMessage for selected user:",
    //   selectedUser?._id
    // );

    // Return cleanup function
    return () => {
      socket.off("newMessage", handleNewMessage);

      // console.log("Unsubscribed from newMessage.");
    };
  },

  uploadProfilePic: async (profilePic) => {
    try {
      set({ isProfileUpdating: true });
      const formData = new FormData();
      formData.append("profilePic", profilePic);
      const res = await axiosInstance.put("/api/user/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(res.data);
      // get().authUser.profilePic = res.data.data.profilePic;
      set({ authUser: res.data.data });
      set({ isProfileUpdating: false });
    } catch (error) {
      console.log(error.message);
      console.log(error?.response?.data);
      set({ isProfileUpdating: false });
    }
  },

  // TODO: ADD REAL TIME TYPING STATUS

  startTyping: (receiverId) => {
    const { authUser, socket } = get();
    if (!socket || !authUser) return;
    const data = {
      senderId: authUser._id,
      receiverId,
    };
    socket.emit("typing", data);
    // console.log("Started typing for receiver:", receiverId);
    set({ isTyping: true });
  },

  stopTyping: (receiverId) => {
    const { authUser, socket } = get();
    if (!socket || !authUser) return;

    const data = {
      senderId: authUser._id,
      receiverId,
    };

    socket.emit("stopTyping", data);
    // console.log("Stopped typing for receiver:", receiverId);
    set({ isTyping: false });
  },

  handleTyping: (receiverId) => {
    const { socket, authUser, startTyping, stopTyping, typingTimeout } = get();
    if (!socket || !authUser) return;
    startTyping(receiverId);
    const timeout = setTimeout(() => {
      stopTyping(receiverId);
    }, 3000);
    console.log(timeout);
    set({ typingTimeout: timeout });
  },
  setIsUserTyping: (typing) => set({ isUserTyping: typing }),
}));
