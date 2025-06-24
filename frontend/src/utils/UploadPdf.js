import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const MAX_FILE_SIZE_MB = 5; // Max 5MB

const uploadDoc = async (pdfPath) => {
  // Validate presence
  if (!pdfPath) {
    throw new Error("Please select a file to upload.");
  }

  // Validate type
  if (pdfPath.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }

  // Validate size
  const sizeInMB = pdfPath.size / (1024 * 1024);
  if (sizeInMB > MAX_FILE_SIZE_MB) {
    throw new Error(`PDF size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
  }

  const formData = new FormData();
  formData.append("pdf", pdfPath);

  try {
    const response = await axiosInstance.post(
      API_PATHS.DOC.UPLOAD_PDF,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "PDF upload failed: ",
      error?.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to upload PDF");
  }
};

export default uploadDoc;
