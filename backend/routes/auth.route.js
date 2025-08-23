const router = require("express").Router();
const { registerUserController, loginUserController } = require("../controllers/auth.controller");

router.post('/register', registerUserController);
router.post('/login', loginUserController);


module.exports = router;