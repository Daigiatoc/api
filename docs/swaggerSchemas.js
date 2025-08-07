module.exports = {
  RegisterRequest: {
    type: "object",
    required: ["fullName", "email", "password"],
    properties: {
      fullName: { type: "string", example: "Trương Long" },
      email: { type: "string", example: "long@example.com" },
      password: { type: "string", example: "123456" },
    },
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", example: "long@example.com" },
      password: { type: "string", example: "123456" },
    },
  },
  LogoutRequest: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string" },
    },
  },
  RefreshTokenRequest: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string" },
    },
  },
  User: {
    type: "object",
    properties: {
      _id: { type: "string", example: "64d9c1d9a1d2c5d5b1234567" },
      fullName: { type: "string", example: "Trương Long" },
      email: { type: "string", example: "long@example.com" },
      phoneNumber: { type: "string", example: "0912345678" },
      role: { type: "string", enum: ["user", "admin"] },
      rank: { type: "string" },
      point: { type: "number" },
    },
  },
  AuthResponse: {
    type: "object",
    properties: {
      token: { type: "string" },
      refreshToken: { type: "string" },
      user: { $ref: "#/components/schemas/User" },
    },
  },
};
