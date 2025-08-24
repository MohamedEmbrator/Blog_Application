const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const { Post, validateCreatePost, validateUpdatePost } = require("../models/Post");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");

module.exports.createPostContoller = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No Image Provided" });
  }
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: { url: result.secure_url, publicId: result.public_id }
  });
  res.status(201).json(post);
  fs.unlinkSync(imagePath);
});

module.exports.getAllPostsController = asyncHandler(async (req, res) => {
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    posts = await Post.find().skip((pageNumber - 1) * 3).limit(3).sort({ createdAt: -1 }).populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category }).sort({ createdAt: -1 }).populate("user", ["-password"]);
  } else {
    posts = await Post.find().sort({ createdAt: -1 }).populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});

module.exports.getSinglePostController = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", ["-password"]).populate("comments");
  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }
  res.status(200).json(post);
});

module.exports.getPostsCountController = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();
  res.status(200).json(count);
});

module.exports.deletePostController = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }
  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await cloudinaryRemoveImage(post.image.puplicId);
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post Deleted Successfully", postId: post._id });
  } else {
    res.status(403).json({message: "Access Denied"});
  }
});

module.exports.updatePostController = asyncHandler(async (req, res) => {
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  };
  if (req.user.id !== post.user.toString()) {
    return res.status(403).json({ message: "Access Denied, You Are Not Allowed" });
  }
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category
    }
  }, { new: true }).populate("user", ["-password"]);
  res.status(200).json(updatedPost);
});

module.exports.updatePostImageController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No Image Provided" });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  };
  if (req.user.id !== post.user.toString()) {
    return res.status(403).json({ message: "Access Denied, You Are Not Allowed" });
  }
  await cloudinaryRemoveImage(post.image.publicId);
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
    $set: { image: { url: result.secure_url, publicId: result.public_id } }
  }, { new: true })
  res.status(200).json(updatedPost);
  fs.unlinkSync(imagePath);
});

module.exports.toggleLikeController = asyncHandler(async (req, res) => {
  const loggedInUser = req.user.id;
  const { id: postId } = req.params;
  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  const isPostAlreadyLiked = post.likes.find((user) => user.toString() === loggedInUser);
  if (isPostAlreadyLiked) {
    post = await Post.findByIdAndUpdate(postId, { $pull: { likes: loggedInUser } }, { new: true });
  } else {
    post = await Post.findByIdAndUpdate(postId, { $push: { likes: loggedInUser } }, { new: true });
  }
  res.status(200).json(post);
})