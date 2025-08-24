const router = require("express").Router();
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { createCommentController, getAllCommentsController, deleteCommentController, updateCommentController } = require("../controllers/comments.controller");

router.route("/").post(verifyToken, createCommentController).get(verifyTokenAndAdmin, getAllCommentsController);
router.route("/:id").delete(validateObjectId, verifyTokenAndAuthorization, deleteCommentController).put(validateObjectId, verifyToken, updateCommentController);
module.exports = router;