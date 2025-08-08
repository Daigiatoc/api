// models/metric-rank-catalog.model.js
const mongoose = require("mongoose");

const RankTierSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // "DONG_TOC_THINH_VUONG_I"
    name: { type: String, required: true }, // "Dòng tộc Thịnh Vượng I"
    minScore: { type: Number, required: true }, // ngưỡng điểm tối thiểu để đạt tier
  },
  { _id: false }
);

const MetricRankCatalogSchema = new mongoose.Schema(
  {
    metric: {
      type: String,
      enum: ["POPULATION", "WEALTH", "EDUCATION"],
      unique: true,
      required: true,
    },
    tiers: { type: [RankTierSchema], default: [] }, // nhớ sắp xếp minScore tăng dần
  },
  { timestamps: true }
);

MetricRankCatalogSchema.index({ metric: 1 }, { unique: true });

module.exports = mongoose.model("MetricRankCatalog", MetricRankCatalogSchema);
