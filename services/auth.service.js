const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const { sendMail, EMAIL_TEMPLATES } = require("../utils/sendMail");

exports.register = async ({ fullName, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email đã được sử dụng");

  const hashed = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    fullName,
    email,
    password: hashed,
    status: "inactive", // Chờ xác thực OTP
    otp,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendMail(email, "Xác thực tài khoản", EMAIL_TEMPLATES.VERIFY_EMAIL, {
    fullName,
    otp,
  });

  user.password = undefined;
  return user;
};

exports.verifyEmailOtp = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  if (user.otp !== otp || user.otpExpiresAt < new Date()) {
    throw new Error("OTP không hợp lệ hoặc đã hết hạn");
  }

  user.status = "active";
  user.otp = null;
  user.otpExpiresAt = null;
  user.otpVerified = true;
  await user.save();
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");
  if (user.status !== "active") throw new Error("Tài khoản chưa được xác thực");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Sai mật khẩu");

  await Token.deleteMany({ userId: user._id });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "3h" }
  );

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  await Token.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  });

  user.password = undefined;
  return { token, refreshToken, user };
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  // ⚠️ Giới hạn mỗi 5 phút mới được gửi lại
  const now = Date.now();
  const lastSentAt = user.otpExpiresAt?.getTime() - 10 * 60 * 1000;

  if (lastSentAt && now - lastSentAt < 5 * 60 * 1000) {
    throw new Error("Vui lòng chờ 5 phút trước khi gửi lại OTP.");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpiresAt = new Date(now + 10 * 60 * 1000); // OTP có hiệu lực 10 phút
  user.otpVerified = false;
  await user.save();

  await sendMail(email, "Khôi phục mật khẩu", EMAIL_TEMPLATES.FORGOT_PASSWORD, {
    fullName: user.fullName,
    otp,
  });
};

exports.resetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  if (user.otp !== otp || user.otpExpiresAt < new Date()) {
    throw new Error("OTP không hợp lệ hoặc đã hết hạn");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiresAt = null;
  user.otpVerified = false;
  await user.save();
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Người dùng không tồn tại");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Mật khẩu hiện tại không đúng");

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
};

exports.resetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Email không tồn tại");
  if (!user.otp || user.otp !== otp)
    throw new Error("OTP không đúng hoặc chưa được cấp");

  if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
    throw new Error("OTP đã hết hạn");

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  user.otpVerified = true;
  await user.save();
};
