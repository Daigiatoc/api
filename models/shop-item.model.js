// models/shop-item.model.js
const mongoose = require("mongoose");

const ShopItemSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // "GOLD_DRAGON"
    name: { type: String, required: true },
    description: String,
    imageUrl: String,
    priceLT: { type: Number, required: true, min: 50 }, // giá bằng Linh Thạch
    isGiftableToClan: { type: Boolean, default: true }, // cho phép chọn owner=CLAN
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ShopItemSchema.index({ isActive: 1 });

module.exports = mongoose.model("ShopItem", ShopItemSchema);
