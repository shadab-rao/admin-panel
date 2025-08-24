const authModel = require("../models/authModel");
const resetPassModel = require("../models/resetPassModel");
const { SendEmail } = require("../utils/SendEmail");
const bcrypt = require("bcryptjs");

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });
    const user = await authModel.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ msg: "Email not valid,please check again" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log(expiresAt);

    await resetPassModel.create({
      email,
      otp,
      expiresAt,
    });

    await SendEmail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
      html: `<h2>Password Reset</h2>
             <p>Your OTP is: <b>${otp}</b></p>
             <p>This OTP will expire in 10 minutes.</p>`,
    });

    res.json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp)
      return res.status(400).json({ msg: "Email and OTP required" });
    const record = await resetPassModel
      .findOne({ email, otp })
      .sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ msg: "Invalid OTP" });
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    record.verified = true;
    await record.save();
    res.json({ msg: "OTP verified" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "All fields required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const record = await resetPassModel
      .findOne({ email })
      .sort({ createdAt: -1 });
    if (!record || !record.verified) {
      return res.status(400).json({ msg: "OTP not verified" });
    }

    const user = await authModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      return res
        .status(400)
        .json({ msg: "New password cannot be same as old password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await resetPassModel.deleteMany({ email });

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { forgotPassword, verifyOtp, resetPassword };
