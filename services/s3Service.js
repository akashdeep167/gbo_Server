const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3.config");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Uploads a file to S3 and returns the URL
const uploadImageToS3 = async (file) => {
  const fileExtension = path.extname(file.originalname);
  const uniqueFileName = `${uuidv4()}${fileExtension}`;

  const bucketName = process.env.S3_BUCKET_NAME;

  // Log to ensure bucket name is being read
  console.log("Bucket Name:", bucketName); // This should print the correct bucket name

  const params = {
    Bucket: bucketName, // Bucket name from environment variable
    Key: uniqueFileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: "public-read", // Makes file publicly readable
  };

  try {
    await s3.send(new PutObjectCommand(params));
    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
    return imageUrl;
  } catch (error) {
    throw new Error("S3 Upload Error: " + error.message);
  }
};

module.exports = { uploadImageToS3 };
