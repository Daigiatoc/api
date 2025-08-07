// sockets/index.js

module.exports = (server) => {
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: "*", // Cho phép mọi nguồn, bạn có thể thay bằng domain cụ thể
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡️ Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};
