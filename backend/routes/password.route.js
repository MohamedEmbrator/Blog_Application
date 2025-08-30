const router = require("express").Router();
const { sendResetPasswordLinkContoller, getResetPasswordLinkController, resetPasswordController } = require("../controllers/password.controller");


router.post("/reset-pasword-link", sendResetPasswordLinkContoller);
router.route("/reset-password/:userId/:token").get(getResetPasswordLinkController).post(resetPasswordController);

module.exports = router;