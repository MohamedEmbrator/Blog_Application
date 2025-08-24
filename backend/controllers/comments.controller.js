const asyncHandler = require("express-async-handler");
const { Comment, validateCreateComment, validateUpdateComment } = require("../models/Comment");
const { User } = require("../models/User");

module.exports.createCommentController = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  
  const profile = await User.findById(req.user.id);
  const comment = await Comment.create({
    postId: req.body.postId,
    text: req.body.text,
    user: req.user.id,
    username: profile.username
  });
  res.status(201).json(comment);
});

module.exports.getAllCommentsController = asyncHandler(async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 }).populate("user", ["-password"]);
  res.status(200).json(comments);
});

module.exports.deleteCommentController = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404).json({ message: "Comment Not Found" });
  }
  if (req.user.isAdmin || req.user.id === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment Deleted Successfully" });
  } else {
    res.status(403).json({ message: "Access Denied, Not Allowed" });
  }
});


module.exports.updateCommentController = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404).json({ message: "Comment Not Found" });
  }
  if (req.user.id !== comment.user.toString()) {
    res.status(403).json({ message: "Access Denied, Not Allowed" });
  }
  const updatedComment = await Comment.findByIdAndUpdate(req.params.id, { $set: { text: req.body.text } }, {new: true});
  res.status(200).json(updatedComment);
});