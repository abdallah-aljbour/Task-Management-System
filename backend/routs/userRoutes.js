const express = require("express");
const userConteroller = require("../controller/usercontroller");
const router = express.Router();

router.post("/signup", userConteroller.signup);
router.post("/login", userConteroller.login);

module.exports = router;
