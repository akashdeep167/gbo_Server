const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const karigarController = require("../controllers/karigar.controller");

// Create a new Karigar
router.post("/", [authJwt.verifyToken], karigarController.createKarigar);

// Retrieve all Karigars
router.get("/", [authJwt.verifyToken], karigarController.getAllKarigars);
router.put(
  "/karigars/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  karigarController.updateKarigar
);

// Route to delete a karigar by ID
router.delete(
  "/karigars/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  karigarController.deleteKarigar
);

module.exports = router;
