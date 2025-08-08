// models/linhthach-ledger.model.js
const mongoose = require("mongoose");

const LinhThachLedgerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clan: { type: mongoose.Schema.Types.ObjectId, ref: "Clan", required: true },

    direction: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
    amount: { type: Number, required: true, min: 1 },

    source: {
      type: String,
      enum: [
        // nạp
        "PURCHASE_TOPUP",
        "AD_REWARD",
        "ADMIN_ADJUST",
        "SYSTEM",
        // chi tiêu
        "SHOP_PURCHASE",
      ],
      required: true,
    },
    refType: String, // "ORDER", 'PAYMENT'
    refId: String, // orderId

    note: String,
  },
  { timestamps: true }
);

LinhThachLedgerSchema.index({ clan: 1 });
LinhThachLedgerSchema.index({ user: 1, createdAt: -1 });
LinhThachLedgerSchema.index({ source: 1, direction: 1 });

module.exports = mongoose.model("LinhThachLedger", LinhThachLedgerSchema);
