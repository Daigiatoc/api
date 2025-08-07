const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true, // Cho phép null nhưng vẫn unique nếu có
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    dateOfBirth: {
      type: Date,
    },
    avatarUrl: {
      type: String,
    },

    // Cấp độ người dùng
    point: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    rank: {
      type: String,
      enum: ["newbie", "bronze", "silver", "gold", "diamond"],
      default: "newbie",
    },

    // Trạng thái tài khoản
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },

    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    familyName: String, // Họ tộc
    levelExp: {
      type: Number,
      default: 0,
    }, // Điểm kinh nghiệm (tăng theo hành động)
    bio: {
      type: String,
      maxlength: 300,
    },
    address: {
      type: String,
      maxlength: 255,
    }, // Địa chỉ liên hệ
    otp: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true, // Thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);
