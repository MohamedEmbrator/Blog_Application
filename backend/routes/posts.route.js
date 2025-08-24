const router = require("express").Router();
const { createPostContoller, getAllPostsController, getSinglePostController, getPostsCountController, deletePostController, updatePostController, updatePostImageController, toggleLikeController } = require("../controllers/posts.controller");
const photoUpload = require("../middlewares/photoUpload");
const { verifyToken } = require("../middlewares/verifyToken");
const  validateObjectId = require("../middlewares/validateObjectId");

router.route("/").post(verifyToken, photoUpload.single("image"), createPostContoller).get(getAllPostsController);
router.route("/count").get(getPostsCountController);
router.route("/:id").get(validateObjectId, getSinglePostController).delete(validateObjectId, verifyToken, deletePostController).put(validateObjectId, verifyToken, updatePostController);
router.route("/update-image/:id").put(validateObjectId, verifyToken, photoUpload.single("image"), updatePostImageController);
router.route("/like/:id").put(validateObjectId, verifyToken, toggleLikeController);


module.exports = router;