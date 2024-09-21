const express = require("express");
const { uploadImages } = require("../controllers/image.controller");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// POST route to upload images
router.post("/upload", upload.array("images", 10), uploadImages);

module.exports = router;
