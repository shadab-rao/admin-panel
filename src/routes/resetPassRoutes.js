const { forgotPassword, verifyOtp, resetPassword } = require("../controllers/resetController");

const router = require("express").Router();


router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
