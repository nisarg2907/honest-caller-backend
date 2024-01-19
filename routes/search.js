const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search");
const authMiddleware = require("../middleware/auth");

router.post("/name/:name", authMiddleware.verifyToken,searchController.searchName);
router.post("/phone/:phone", authMiddleware.verifyToken,searchController.searchPhone);

module.exports = router;
