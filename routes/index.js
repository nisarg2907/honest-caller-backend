const express = require("express");
const router = express.Router();
const spamRoutes = require("./spam")
const authRoutes = require("./auth");
const searchRoutes = require("./search");
router.use("/auth",authRoutes);
router.use("/spam",spamRoutes);
router.use("/search",searchRoutes)

module.exports=router;