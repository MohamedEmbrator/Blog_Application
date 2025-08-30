const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateEmail, validateNewPassword } = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

module.exports.sendResetPasswordLinkContoller = asyncHandler(async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User given email does not exist!" });
  }
  let verificationToken = await VerificationToken.findOne({ userId: user._id });
  if (!verificationToken) {
    verificationToken = new VerificationToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await verificationToken.save();
  }
  const link = `http://localhost:5173/reset-password/${user._id}/${verificationToken.token}`;
  const htmlTemplate = `<a href="${link}">Click here to reset your password</a>`;
  // await sendEmail(user.email, "Reset Password", htmlTemplate);
  res.status(200).json({ message: "Password reset link sent to your email" });
});

module.exports.getResetPasswordLinkController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid Link" });
  }
  const verificationToken = VerificationToken.findOne({ userId: user._id, token: req.params.token });
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid Link" });
  }
  res.status(200).json({ message: "Valid URL" });

});

module.exports.resetPasswordController = asyncHandler(async (req, res) => {
  const { error } = validateNewPassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid Link" });
  }
  const verificationToken = await VerificationToken.findOne({ userId: user._id, token: req.params.token });
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid Link" });
  }
  if (!user.isAccountVerified) {
    user.isAccountVerified = true;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;
  await user.save();
  await verificationToken.deleteOne();
  res.status(200).json({ message: "Password reset successfully" });
});