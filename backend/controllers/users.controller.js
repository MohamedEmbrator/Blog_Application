const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");
const path = require('path');
const fs = require('fs');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");
module.exports.getAllUsersController = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("posts");
  res.status(200).json(users);
});


module.exports.getUserProfileController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("posts");
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

module.exports.profilePhotoUploadController = asyncHandler(async (req, res) => {
  // 1- Validation
  if (!req.file) {
    return res.status(400).json({ message: "No File Uploaded" });
  }
  // 2- Get Image Path
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // 3- Upload To Cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  
  // 4- Get The User From DB
  const user = await User.findById(req.user.id);

  // 5- Delete The Old Profile Photo If Exist
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // 6- Change The Profile Photo In The DB
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id
  }
  await user.save();

  // 7- Send Response To The Client
  res.status(200).json({
    message: "Your Prfile Photo Uploaded Succefully",
    profilePhoto: { url: result.secure_url, publicId: result.public_id }
  });

  // 8- Remove Image From The Server
  fs.unlinkSync(imagePath);
});

module.exports.deleteUserProfileController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  await cloudinaryRemoveImage(user.profilePhoto.publicId);
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Your Profile Has Been Deleted Succefully" });
});