// models/lt-package.model.js
const mongoose = require("mongoose");

const LtPackageSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // "LT_50", "LT_100"
    title: { type: String, required: true }, // "Gói 50 Linh Thạch"
    ltAmount: { type: Number, required: true, min: 1 },
    bonusLt: { type: Number, default: 0 },

    currency: { type: String, default: "VND" },
    priceFiat: { type: Number, required: true, min: 0 },

    platforms: {
      appleProductId: String,
      googleProductId: String,
      stripePriceId: String,
      otherId: String,
    },

    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

LtPackageSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model("LtPackage", LtPackageSchema);
