const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Token = require("../models/token.model"); // model lưu refreshToken

// ✅ Middleware xác thực access token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Thiếu access token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // gắn thông tin vào req
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Access token không hợp lệ hoặc hết hạn" });
  }
};

// ✅ Middleware phân quyền
exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
  };
};
