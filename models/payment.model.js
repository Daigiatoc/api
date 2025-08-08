// models/payment.model.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    // TOPUP (nạp LT bằng tiền thật)
    type: { type: String, enum: ["TOPUP"], required: true },

    // gói nạp được chọn
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LtPackage",
      required: true,
    },

    // ngữ cảnh
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // optional
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clan: { type: mongoose.Schema.Types.ObjectId, ref: "Clan", required: true },

    // phương thức & nhà cung cấp
    method: {
      type: String,
      enum: ["IAP", "CARD", "EWALLET", "BANK"],
      required: true,
    },
    provider: {
      type: String,
      enum: [
        "APPLE_IAP",
        "GOOGLE_PLAY",
        "STRIPE",
        "PAYPAL",
        "MOMO",
        "ZALOPAY",
        "VNPAY",
        "OTHER",
      ],
      required: true,
    },

    // tiền thật & snapshot LT sẽ cộng
    currency: { type: String, default: "VND" },
    amountFiat: { type: Number, required: true, min: 0 },
    ltAmount: { type: Number, required: true, min: 1 }, // = ltPackage.ltAmount + bonus

    status: {
      type: String,
      enum: [
        "INIT",
        "REQUIRES_ACTION",
        "SUCCEEDED",
        "FAILED",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
      ],
      default: "INIT",
    },

    externalIds: {
      appleOriginalTransactionId: String,
      appleReceipt: String,
      googlePurchaseToken: String,
      googleOrderId: String,
      stripePaymentIntentId: String,
      stripeChargeId: String,
      paypalOrderId: String,
      paypalCaptureId: String,
      momoTransId: String,
      vnpayTxnRef: String,
      zalopayAppTransId: String,
    },

    webhook: { signature: String, rawPayload: String },

    errorCode: String,
    errorMessage: String,
  },
  { timestamps: true }
);

PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ provider: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Payment", PaymentSchema);
