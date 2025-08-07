const authService = require("../services/auth.service");
const Token = require("../models/token.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyEmailOtp(email, otp);
    res.json({ message: "Xác thực email thành công" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ message: "Đăng nhập thành công", ...result });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "Thiếu refresh token" });

  const deleted = await Token.deleteOne({ refreshToken });
  if (deleted.deletedCount === 0) {
    return res
      .status(400)
      .json({ message: "Token không hợp lệ hoặc đã đăng xuất" });
  }

  res.json({ message: "Đăng xuất thành công" });
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Thiếu refresh token" });

    const tokenDoc = await Token.findOne({ refreshToken });
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return res
        .status(403)
        .json({ message: "Refresh token không hợp lệ hoặc hết hạn" });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Thiếu mật khẩu hiện tại hoặc mới" });
    }

    await authService.changePassword(userId, currentPassword, newPassword);

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "Đã gửi OTP khôi phục mật khẩu tới email" });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    next(err);
  }
};
