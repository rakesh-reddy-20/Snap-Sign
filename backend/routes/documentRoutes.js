const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // multer with memoryStorage
const wrapAsync = require("../utils/wrapAsync");

const {
  uploadPdf,
  getAllDocuments,
} = require("../controllers/documentController");

router.post("/upload-pdf", upload.single("pdf"), wrapAsync(uploadPdf));
router.get("/get/documents", wrapAsync(getAllDocuments));

module.exports = router;
