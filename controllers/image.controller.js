const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");

// Configure Cloudinary
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Controller for image upload
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const order_id = req.body.order_id;

    // Upload each file to Cloudinary and ensure cleanup
    const imageUrls = await Promise.all(
      req.files.map((file) => {
        return new Promise(async (resolve, reject) => {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: `orders/${order_id}`,
              use_filename: true,
              unique_filename: false,
            });
            resolve(result.secure_url);
          } catch (error) {
            reject(error);
          } finally {
            // Remove the file from disk
            fs.unlink(file.path, (err) => {
              if (err)
                console.error(`Failed to delete file: ${file.path}`, err);
            });
          }
        });
      })
    );

    res.status(200).json(imageUrls); // Return all uploaded image URLs
  } catch (error) {
    console.error("Error uploading images:", error);

    // Cleanup files on disk if an overall failure occurs
    req.files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error(`Failed to delete file: ${file.path}`, err);
      });
    });

    res.status(500).json({ error: "Failed to upload images" });
  }
};

// Controller for image deletion
const deleteImages = async (req, res) => {
  try {
    const imageUrls = req.body; // Expecting an array of full URLs
    console.log("Received URLs for deletion:", imageUrls);

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res
        .status(400)
        .json({ error: "No image URLs provided for deletion" });
    }

    // Extract public IDs from URLs
    const publicIds = imageUrls.map((url) => {
      const parts = url.split("/upload/")[1]; // Get the part after 'upload/'
      const withoutVersion = parts.replace(/v\d+\//, ""); // Remove the version (e.g., v123456/)
      const withoutExtension = withoutVersion.split(".")[0]; // Remove the file extension
      return withoutExtension;
    });

    console.log("Extracted public IDs for deletion:", publicIds);

    // Delete each image from Cloudinary
    const deletionResults = await Promise.all(
      publicIds.map(async (publicId) => {
        try {
          const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
            invalidate: true,
          });
          return { publicId, result };
        } catch (error) {
          return { publicId, error: error.message || "Deletion failed" };
        }
      })
    );

    const successes = deletionResults.filter((res) => res.result === "ok");
    const failures = deletionResults.filter((res) => res.error);

    res.status(200).json({
      message: `${successes.length} images deleted successfully`,
      successes,
      failures,
    });
  } catch (error) {
    console.error("Error deleting images:", error);
    res.status(500).json({ error: "Failed to delete images" });
  }
};

module.exports = { uploadImages, deleteImages };
