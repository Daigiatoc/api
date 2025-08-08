// models/asset.model.js
const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopItem",
      required: true,
    },
    ownerType: { type: String, enum: ["USER", "CLAN"], required: true },
    ownerRef: { type: mongoose.Schema.Types.ObjectId, required: true }, // userId hoặc clanId
    qty: { type: Number, default: 1, min: 1 },

    sourceOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true }
);

AssetSchema.index({ ownerType: 1, ownerRef: 1 });
AssetSchema.index({ item: 1 });

module.exports = mongoose.model("Asset", AssetSchema);
