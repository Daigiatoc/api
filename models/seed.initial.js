// seed.initial.js
const mongoose = require("mongoose");
const LtPackage = require("./lt-package.model");
const ShopItem = require("./shop-item.model");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"), // <- trỏ lên 1 cấp tới API/.env
});

async function main() {
  const MONGO =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/daigiatoc";
  console.log(process.env.MONGODB_URI);
  await mongoose.connect(MONGO);

  // 1) Seed gói LT
  const ltPackages = [
    {
      code: "LT_50",
      title: "Gói 50 Linh Thạch",
      ltAmount: 50,
      bonusLt: 0,
      currency: "VND",
      priceFiat: 20000,
      platforms: {
        appleProductId: "com.app.lt.50",
        googleProductId: "com.app.lt.50",
      },
      sortOrder: 10,
    },
    {
      code: "LT_100",
      title: "Gói 100 Linh Thạch",
      ltAmount: 100,
      bonusLt: 10,
      currency: "VND",
      priceFiat: 38000,
      platforms: {
        appleProductId: "com.app.lt.100",
        googleProductId: "com.app.lt.100",
      },
      sortOrder: 20,
    },
    {
      code: "LT_250",
      title: "Gói 250 Linh Thạch",
      ltAmount: 250,
      bonusLt: 40,
      currency: "VND",
      priceFiat: 90000,
      platforms: {
        appleProductId: "com.app.lt.250",
        googleProductId: "com.app.lt.250",
      },
      sortOrder: 30,
    },
    {
      code: "LT_500",
      title: "Gói 500 Linh Thạch",
      ltAmount: 500,
      bonusLt: 120,
      currency: "VND",
      priceFiat: 170000,
      platforms: {
        appleProductId: "com.app.lt.500",
        googleProductId: "com.app.lt.500",
      },
      sortOrder: 40,
    },
  ];

  for (const p of ltPackages) {
    await LtPackage.updateOne({ code: p.code }, { $set: p }, { upsert: true });
  }

  // 2) Seed item shop (giá bằng LT)
  const items = [
    {
      code: "GOLD_DRAGON",
      name: "Kim Long",
      description: "Tượng rồng vàng trang trí clan hall.",
      priceLT: 120,
      isGiftableToClan: true,
      isActive: true,
    },
    {
      code: "SILVER_CRANE",
      name: "Hạc Bạc",
      description: "Cặp hạc bạc mang lại may mắn.",
      priceLT: 80,
      isGiftableToClan: true,
      isActive: true,
    },
    {
      code: "JADE_PLATE",
      name: "Ngọc Bích",
      description: "Đĩa ngọc bích cổ.",
      priceLT: 60,
      isGiftableToClan: true,
      isActive: true,
    },
    {
      code: "ALTAR_LAMP",
      name: "Đèn Thờ",
      description: "Đèn bàn thờ cao cấp.",
      priceLT: 40,
      isGiftableToClan: true,
      isActive: true,
    },

    // Các item tương tác giá rẻ
    {
      code: "INCENSE",
      name: "Thắp Nhang",
      description: "Thắp một nén nhang dâng lên tổ tiên.",
      priceLT: 5, // vừa đủ 1 quảng cáo 30s
      isGiftableToClan: true,
      isActive: true,
    },
    {
      code: "LIGHT_LAMP",
      name: "Đốt Đèn",
      description: "Đốt đèn dầu cầu an.",
      priceLT: 5,
      isGiftableToClan: true,
      isActive: true,
    },
    {
      code: "PRAY",
      name: "Cầu Nguyện",
      description: "Cầu nguyện cho gia tộc bình an.",
      priceLT: 5,
      isGiftableToClan: true,
      isActive: true,
    },
  ];

  for (const it of items) {
    await ShopItem.updateOne({ code: it.code }, { $set: it }, { upsert: true });
  }

  console.log("✅ Seed done.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
