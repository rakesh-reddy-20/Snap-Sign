export const BASE_URL = "http://localhost:8080/api/v1";

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register", // Register a new user (Admin or Member)
    LOGIN: "/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/auth/profile", // Get logged-in user details
  },

  UPLOADS: {
    STORE_DOC_DATA: "/document/save", // Store Docs(PDFs)
    DELETE_STORED_DATA: (userId) => `/document/deleteDoc/${userId}`, // Delete selected Docs(PDFs)
    SHOW_ALL_DOCS: "/document/allDocuments", // Get all the Docs(PDFs)
  },

  IMAGE: {
    UPLOAD_IMAGE: "/document/upload-pdf", // Upload Pdf
  },
};
