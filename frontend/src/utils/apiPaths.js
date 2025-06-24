export const BASE_URL = "http://localhost:8080";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register", // Register a new user (Admin or Member)
    LOGIN: "/api/v1/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/v1/auth/profile", // Get logged-in user details
    DELETE_PROFILE: "/api/v1/auth/deleteProfile", // Delete the profile
  },

  DOC: {
    STORE_DOC: "/api/v1/document/save", // Save doc
    DELETE_DOC: (docId) => `/api/v1/document/deleteDoc/${docId}`, // Delete pdf by ID
    ALL_DOCS: "/api/v1/document/allDocuments", // Show all docs
  },

  UPLOAD: {
    UPLOAD_DOC: "/api/v1/document/upload-pdf", // Upload PDFs
  },
};
