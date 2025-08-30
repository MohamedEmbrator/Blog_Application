const router = require("express").Router();
const { registerUserController, loginUserController, verifyUserAccountController } = require("../controllers/auth.controller");

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/:userId/verify/:token", verifyUserAccountController);

module.exports = router;
