const mongoose = require("mongoose");

const EducationItemSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      enum: ["PRIMARY", "SECONDARY", "BACHELOR", "MASTER", "PHD", "CERT"],
      required: true,
    },
    field: String,
    institution: String,
    graduationYear: Number,
    certificateUrl: String,
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    familyName: {
      type: String, // Họ tộc gốc, ví dụ "Nguyễn"
      trim: true,
    },
    familyNameNormalized: {
      type: String, // Họ tộc chuẩn hóa không dấu, ví dụ "nguyen"
      trim: true,
      lowercase: true,
      index: true,
    },
    givenNames: {
      type: String, // phần tên còn lại ngoài họ
      trim: true,
    },

    clan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clan", // Liên kết sang bảng Clan
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

    // Linh Thạch (cache để hiển thị nhanh)
    ltBalance: {
      type: Number,
      default: 0,
    },

    // Học vấn
    education: [EducationItemSchema],

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
    levelExp: {
      type: Number,
      default: 0,
    }, // Điểm kinh nghiệm (tăng theo hành động)

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

    bio: {
      type: String,
      maxlength: 300,
    },
    address: {
      type: String,
      maxlength: 255,
    }, // Địa chỉ liên hệ

    // OTP xác thực
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
