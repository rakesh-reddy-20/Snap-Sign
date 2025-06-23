const Document = require("../models/Document");

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
