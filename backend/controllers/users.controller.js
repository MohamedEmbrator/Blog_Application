const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");

module.exports.getAllUsersController = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});


module.exports.getUserProfileController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  res.status(200).json(user);
});


module.exports.updateUserProfileController = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      username: req.body.username,
      password: req.body.password,
      bio: req.body.password
    }
  }, { new: true }).select("-password");
  res.status(200).json(updatedUser);
});

module.exports.getUsersCountController = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json(count);
});
