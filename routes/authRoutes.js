const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const {
  validateRegister,
  validateLogin
} = require("../validations/authValidation");

router.post("/register", validateRegister, auth.register);
router.post("/login", validateLogin, auth.login);

module.exports = router;
