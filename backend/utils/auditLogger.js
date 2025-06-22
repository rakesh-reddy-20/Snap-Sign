// utils/auditLogger.js
const Document = require("../models/document");

const logAuditEvent = async ({ docId, action, userId, ip }) => {
  await Document.findByIdAndUpdate(docId, {
    $push: {
      auditTrail: {
        action,
        performedBy: userId,
        ip: ip || "unknown",
        timestamp: new Date(),
      },
    },
  });
};

module.exports = logAuditEvent;
