const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const { User, validateRegisterUser, validateLoginUser } = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail");

module.exports.registerUserController = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "User Already Exist" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user = new User({ username: req.body.username, email: req.body.email, password: hashedPassword });
  await user.save();

  const verificationToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  })
  await verificationToken.save();
  const link = `http://localhost:5173/users/${user._id}/verify/${verificationToken.token}`;
  const htmlTemplate = `
  <div>
    <p>
      Click on the link below to verify your email
    </p>
    <a href="${link}">Verify</a> 
  </div>
  `;

  // await sendEmail(user.email, "Verify Your Email", htmlTemplate);

  res.status(201).json({ message: "You Registered Successfully, Check Your Email to verify your email address" });
});

module.exports.loginUserController = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }
  const isPassowordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isPassowordMatch) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }
  if (!user.isAccountVerified) {
    let verificationToken = await VerificationToken.findOne({ userId: user._id });
    if (!verificationToken) {
      verificationToken = new VerificationToken({ userId: user._id, token: crypto.randomBytes(32).toString("hex") });
      await verificationToken.save();
      const link = `http://localhost:5173/users/${user._id}/verify/${verificationToken.token}`;
      const htmlTemplate = `
      <div>
        <p>
          Click on the link below to verify your email
        </p>
        <a href="${link}">Verify</a> 
      </div>
      `;
      // await sendEmail(user.email, "Verify Your Email", htmlTemplate);
    }
    return  res.status(400).json({ message: "We sent to you an email, Check Your Email to verify your email address" });
  }
  const token = user.generateAuthToken();
  res.status(200).json({ _id: user._id, isAdmin: user.isAdmin, profilePhoto: user.profilePhoto, token, username: user.username });
});

module.exports.verifyUserAccountController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid Link" });
  }
  const verificationToken = await VerificationToken.findOne({ userId: user._id, token: req.params.token });
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid Link" });
  }
  user.isAccountVerified = true;
  await user.save();
  await verificationToken.deleteOne();
  res.status(200).json({ message: "Your Account Verified Successfully" });
});