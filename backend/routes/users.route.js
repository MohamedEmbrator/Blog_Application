const router = require("express").Router();
const { getAllUsersController, getUserProfileController, updateUserProfileController, getUsersCountController } = require("../controllers/users.controller");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser } = require("../middlewares/verifyToken");


router.route("/profile").get(verifyTokenAndAdmin, getAllUsersController);
router.route("/profile/:id").get(validateObjectId, getUserProfileController).put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileController);
router.route("/count").get(verifyTokenAndAdmin, getUsersCountController);

module.exports = router;