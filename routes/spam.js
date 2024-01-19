const express = require("express");
const router = express.Router();
const spamController = require("../controllers/spam");
const authMiddleware = require("../middleware/auth");
router.put("/mark-spam",authMiddleware.verifyToken,spamController.markSpam);

module.exports= router;