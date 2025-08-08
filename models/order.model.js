// models/order.model.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const OrderLineSchema = new Schema(
  {
    item: { type: Types.ObjectId, ref: "ShopItem", required: true },
    qty: { type: Number, min: [1, "qty >= 1"], default: 1 },
    unitPriceLT: { type: Number, min: [1, "unitPriceLT >= 1"], required: true },

    ownerModel: { type: String, enum: ["User", "Clan"], required: true },
    ownerRef: {
      type: Types.ObjectId,
      required: true,
      refPath: "lines.ownerModel",
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    buyerUser: { type: Types.ObjectId, ref: "User", required: true },
    buyerClan: { type: Types.ObjectId, ref: "Clan", required: true },

    lines: {
      type: [OrderLineSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Order must have at least 1 line.",
      },
    },

    // tổng LT phải trả (auto-calc)
    subtotalLT: { type: Number, min: [1, "subtotalLT >= 1"], required: true },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"],
      default: "PENDING",
    },

    // snapshot LT đã trừ (đối soát ledger)
    ltCharged: { type: Number, default: 0 },

    // liên kết entry DEBIT SHOP_PURCHASE
    ledgerEntryId: { type: Types.ObjectId, ref: "LinhThachLedger" },

    note: String,
    paidAt: Date,
    refundedAt: Date,
  },
  { timestamps: true }
);

// Auto-calc subtotalLT
OrderSchema.pre("validate", function calcSubtotalLT(next) {
  try {
    if (Array.isArray(this.lines) && this.lines.length > 0) {
      const sum = this.lines.reduce(
        (acc, l) => acc + Number(l.qty || 0) * Number(l.unitPriceLT || 0),
        0
      );
      if (!this.subtotalLT || this.subtotalLT !== sum) this.subtotalLT = sum;
    }
    next();
  } catch (e) {
    next(e);
  }
});

OrderSchema.index({ buyerClan: 1, status: 1, createdAt: -1 });
OrderSchema.index({ buyerUser: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Order", OrderSchema);
