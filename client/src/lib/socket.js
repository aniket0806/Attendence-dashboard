
import { io } from "socket.io-client";
import { HOST } from "../utils/constants";

console.log("🔌 Connecting to socket server:", HOST);

const socket = io(HOST, {
  auth: {
    token: localStorage.getItem("token"),
  },
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// // Debug logging
// socket.on("connect", () => {
//   console.log(" Socket connected successfully!", socket.id);
// });

// socket.on("disconnect", (reason) => {
//   console.log(" Socket disconnected:", reason);
// });

// socket.on("connect_error", (error) => {
//   console.error(" Socket connection error:", error);
// });

// socket.on("reconnect", (attemptNumber) => {
//   console.log(" Socket reconnected after", attemptNumber, "attempts");
// });

// socket.on("reconnect_error", (error) => {
//   console.error(" Socket reconnection error:", error);
// });

// // Test connection
// socket.on("welcome", (data) => {
//   console.log(" Welcome message received:", data);
// });

export default socket;