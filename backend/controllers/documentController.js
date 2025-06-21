const express = require("express");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// @desc   Upload pdf
// @route  POST/api/v1/document/upload-pdf
// @access Public (protect)
const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const streamUpload = (buffer, originalname) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "pdfs",
            public_id: originalname.replace(/\.pdf$/i, ""), // optional but useful
            format: "pdf", // ensure it saves/serves as PDF
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer, req.file.originalname);

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// @desc   Get all pdf
// @route  get/api/v1/document/getAllPdf
// @access Public (protect)
const getAllDocuments = async (req, res) => {};

module.exports = {
  uploadPdf,
  getAllDocuments,
};
