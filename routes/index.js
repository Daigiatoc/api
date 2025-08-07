const express = require("express");
const router = express.Router();

// Gắn route auth
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

module.exports = router;
