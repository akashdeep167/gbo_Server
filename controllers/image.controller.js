const { uploadImageToS3 } = require("../services/s3Service");

// Controller for image upload
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const order_id = req.body.order_id;
    const imageUrls = await Promise.all(
      req.files.map((file) => uploadImageToS3(file, order_id))
    );

    res.status(200).json(imageUrls); // Return the array of image URLs
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

module.exports = { uploadImages };
