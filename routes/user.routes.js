const express = require("express");
const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

const router = express.Router();

// Middleware to add headers
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Public access route
router.get("/test/all", controller.allAccess);

// User board route - protected
router.get("/test/user", [authJwt.verifyToken], controller.userBoard);

// Moderator board route - protected and requires moderator role
router.get(
  "/test/mod",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.moderatorBoard
);

// Admin board route - protected and requires admin role
router.get(
  "/test/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
);

module.exports = router;
