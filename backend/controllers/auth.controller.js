const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const { User, validateRegisterUser, validateLoginUser } = require("../models/User");

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
  res.status(201).json({ message: "You Registered Successfully" });
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
  const token = user.generateAuthToken();
  res.status(200).json({ _id: user._id, isAdmin: user.isAdmin, profilePhoto: user.profilePhoto, token, username: user.username });
});