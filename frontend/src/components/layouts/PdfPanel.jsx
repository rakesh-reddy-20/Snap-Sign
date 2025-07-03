import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";

const PdfPanel = ({
  previewUrl,
  droppedPosition,
  setDroppedPosition,
  isSigningComplete,
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: "pdfPanel" });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: "signature",
    disabled: isSigningComplete,
  });

  const style = {
    position: "absolute",
    top: `${droppedPosition?.y || 0}px`,
    left: `${droppedPosition?.x || 0}px`,
    zIndex: 10,
    pointerEvents: "auto",
    cursor: isSigningComplete ? "default" : "move",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "none",
  };

  return (
    <div className="col-span-12 md:col-span-9 bg-white p-4 shadow rounded overflow-hidden h-full relative">
      <div
        ref={setNodeRef}
        className={`relative h-full border rounded overflow-auto ${
          isOver ? "border-blue-500 bg-blue-100" : "border-gray-400"
        }`}
      >
        <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
          <div className="min-h-full w-full">
            <Viewer fileUrl={previewUrl} />
          </div>

          {droppedPosition && (
            <div
              ref={setDragRef}
              {...listeners}
              {...attributes}
              style={style}
              className="px-4 py-2 bg-gray-100 border rounded-md text-lg text-gray-700 font-signature"
            >
              {droppedPosition.text}
            </div>
          )}
        </Worker>
      </div>
    </div>
  );
};

export default PdfPanel;
