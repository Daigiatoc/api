// models/clan.model.js
const mongoose = require("mongoose");

const ClanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    aliases: [{ type: String }],

    metrics: {
      populationCount: { type: Number, default: 0 },
      // Tổng CHI TIÊU LT của user trong clan (DEBIT từ mua shop)
      wealthSpentLT: { type: Number, default: 0 },
      // Tổng điểm học vấn (sum max-degree/verified mỗi user)
      educationScore: { type: Number, default: 0 },
      lastComputedAt: Date,
    },

    ranks: {
      population: { type: String },
      wealth: { type: String },
      education: { type: String },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ClanSchema.index({ slug: 1 }, { unique: true });
ClanSchema.index({ "metrics.populationCount": -1 });
ClanSchema.index({ "metrics.wealthSpentLT": -1 });
ClanSchema.index({ "metrics.educationScore": -1 });

module.exports = mongoose.model("Clan", ClanSchema);
