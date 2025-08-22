const express = require("express");
const { signupUser, login, userProfile } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/signup",signupUser);
router.post("/login",login);
router.get("/profile",authMiddleware,userProfile)

module.exports=router;