const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const initSocket = require("./sockets");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Kết nối socket.io
initSocket(server);

// Kết nối MongoDB rồi khởi động server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
});
