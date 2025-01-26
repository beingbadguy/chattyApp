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

  login: async (data, navigate) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/api/auth/login", data);
      console.log(res.data);
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
      console.log(res.data);
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
    console.log(res.data);
    get().disconnectSocket();
    set({ authUser: null });
    set({ socket: null });
    set({ allUsers: [] });
    navigate("/");
  },
  checkAuth: async () => {
    try {
      set({ isAuthChecking: true });
      const res = await axiosInstance.get("/api/auth/verify");
      get().getAllUsers();

      get().connectSocket();
      console.log("checkAuthRan");
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
  sendMessage: async (text) => {
    const { selectedUser, message } = get();
    try {
      const res = await axiosInstance.post(
        `/api/message/send/${selectedUser._id}`,
        { text }
      );
      // console.log(res.data);
      set({ message: [...message, res.data] });
    } catch (error) {
      console.log(error.message);
      console.log(error?.response?.data);
    }
  },
  getMessages: async (userId) => {
    try {
      const res = await axiosInstance.get(`/api/message/messages/${userId}`);
      console.log(res.data);
      set({ message: res.data });
    } catch (error) {
      console.log(error.message);
      console.log(error?.response?.data);
    }
  },

  subscribeToMessage: () => {
    const { selectedUser, socket, authUser } = get();

    if (!socket) {
      console.error("Socket instance is not initialized.");
      return;
    }

    if (!selectedUser) {
      console.log("No user selected.");
      return;
    }

    // Clean up any existing listener to avoid duplicates
    socket.off("newMessage");

    const handleNewMessage = (newMessage) => {
      console.log("Received newMessage:", newMessage);

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

    console.log(
      "Subscribed to newMessage for selected user:",
      selectedUser?._id
    );

    // Return cleanup function
    return () => {
      socket.off("newMessage", handleNewMessage);
      console.log("Unsubscribed from newMessage.");
    };
  },
}));
