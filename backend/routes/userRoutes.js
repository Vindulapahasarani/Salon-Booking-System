const express = require("express");
const { getMyProfile, updateMyProfile } = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);

module.exports = router;
