const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // multer with memoryStorage
const isAuthorized = require("../middleware/authMiddleware");
const wrapAsync = require("../utils/wrapAsync");

const {
  uploadPdf,
  storeUploadPdfMetaData,
  deleteStoredDoc,
  getAllDocuments,
} = require("../controllers/documentController");

router.post(
  "/upload-pdf",
  isAuthorized,
  upload.single("pdf"),
  wrapAsync(uploadPdf)
);
router.post("/save", isAuthorized, wrapAsync(storeUploadPdfMetaData));
router.delete("/deleteDoc/:id", isAuthorized, deleteStoredDoc);
router.get("/allDocuments", isAuthorized, wrapAsync(getAllDocuments));

module.exports = router;
