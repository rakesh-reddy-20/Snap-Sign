const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // multer with memoryStorage
const protect = require("../middleware/authMiddleware");
const wrapAsync = require("../utils/wrapAsync");

const {
  uploadPdf,
  storeUploadPdfMetaData,
  deleteStoredDoc,
  getAllDocuments,
} = require("../controllers/documentController");

router.post("/upload-pdf", protect, upload.single("pdf"), wrapAsync(uploadPdf));
router.post("/save", protect, wrapAsync(storeUploadPdfMetaData));
router.delete("/deleteDoc/:id", protect, deleteStoredDoc);
router.get("/allDocuments", protect, wrapAsync(getAllDocuments));

module.exports = router;
