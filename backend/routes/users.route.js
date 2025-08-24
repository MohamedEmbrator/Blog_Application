const router = require("express").Router();
const { getAllUsersController, getUserProfileController, updateUserProfileController, getUsersCountController, profilePhotoUploadController, deleteUserProfileController } = require("../controllers/users.controller");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyToken, verifyTokenAndAuthorization } = require("../middlewares/verifyToken");


router.route("/profile").get(verifyTokenAndAdmin, getAllUsersController);
router.route("/profile/:id").get(validateObjectId, getUserProfileController).put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileController).delete(validateObjectId, verifyTokenAndAuthorization, deleteUserProfileController);
router.route("/count").get(verifyTokenAndAdmin, getUsersCountController);
router.route("/profile/profile-photo-upload").post(verifyToken, photoUpload.single("image"), profilePhotoUploadController);
module.exports = router;