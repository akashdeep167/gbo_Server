const express = require("express");
const { verifySignUp } = require("../middleware");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsername, verifySignUp.checkRolesExisted],
  authController.signup
);

router.post("/signin", authController.signin);

module.exports = router;
