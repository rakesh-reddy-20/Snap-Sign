const express = require("express");
const cloudinary = require("../config/cloudinary");

const streamifier = require("streamifier");
const Document = require("../models/Document");

const logAuditEvent = require("../utils/auditLogger");

// @desc   Upload pdf to cloudniry
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
const getAllDocuments = async (req, res) => {
  try {
    // Ensure user is authenticated
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch documents where the current user is the owner
    const documents = await Document.find({ owner: userId })
      .populate("sharedWith", "name email") // optional: populate shared users
      .sort({ createdAt: -1 });

    if (documents.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No PDF uploaded by you!",
      });
    }

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Server error while fetching documents." });
  }
};

// @desc   upload Doc with proper info
// @route  get/api/v1/document/storeDoc
// @access Public (protect)
const storeUploadPdfMetaData = async (req, res) => {
  try {
    const { title, fileUrl, owner, sharedWith, isSigned, signedBy, signature } =
      req.body;

    // Validate required fields
    if (!title || !fileUrl || !owner) {
      return res.status(400).json({
        message:
          "Missing one of the required fields: title, fileUrl, or owner.",
      });
    }

    // Create document
    const savedDocument = await Document.create({
      title,
      fileUrl,
      owner,
      sharedWith,
      isSigned: isSigned || false,
      signedBy: signedBy || null,
      signature: signature || null,
    });

    await logAuditEvent({
      docId: savedDocument._id,
      action: "signed",
      userId: req.user._id,
      ip: req.ip,
    });

    res.status(201).json({
      message: "Document saved successfully!",
      document: savedDocument,
    });
  } catch (error) {
    console.error("Error saving document metadata:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc   delete selected pdf
// @route  get/api/v1/document/deleteDoc
// @access Public (protect)
const deleteStoredDoc = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Document ID is required." });
    }

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found." });
    }

    if (String(doc.owner) !== String(req.user._id)) {
      return res.status(403).json({
        message: "Not authorized to delete this document.",
      });
    }

    // Delete from MongoDB
    await Document.findByIdAndDelete(id);

    res.status(200).json({
      message: "Document deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Server error while deleting document." });
  }
};

module.exports = {
  uploadPdf,
  storeUploadPdfMetaData,
  deleteStoredDoc,
  getAllDocuments,
};
