import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";

const PdfPanel = ({ previewUrl }) => {
  return (
    <div className="col-span-12 md:col-span-9 bg-white p-4 shadow rounded overflow-hidden h-full">
      <div className="h-full border border-gray-300 rounded overflow-auto">
        <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
          <div className="min-h-full w-full">
            <Viewer fileUrl={previewUrl} />
          </div>
        </Worker>
      </div>
    </div>
  );
};

export default PdfPanel;
