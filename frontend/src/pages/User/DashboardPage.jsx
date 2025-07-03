import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import {
  DndContext,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import SignPanel from "@/components/layouts/SignPanel";
import PdfPanel from "@/components/layouts/PdfPanel";

const Home = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [signText, setSignText] = useState("");
  const [droppedPosition, setDroppedPosition] = useState(null);
  const [isSigningComplete, setIsSigningComplete] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setIsSigningComplete(false);
    } else {
      alert("Please select a PDF file");
      setFile(null);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDragEnd = (event) => {
    const { active, over, delta } = event;

    if (!over) return;

    if (active.id === "signature" && droppedPosition) {
      setDroppedPosition((prev) => ({
        ...prev,
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      }));
    } else if (
      active.id === "signature" &&
      active.rect?.current?.translated &&
      over.rect
    ) {
      const rect = active.rect.current.translated;
      const dropX = rect.left;
      const dropY = rect.top;

      const containerRect = over.rect;
      const relativeX = dropX - containerRect.left;
      const relativeY = dropY - containerRect.top;

      setDroppedPosition({
        x: relativeX,
        y: relativeY,
        text: signText,
      });
    }
  };

  const handleSignDocument = () => {
    if (!droppedPosition) {
      alert("Please drag your signature to the document first");
      return;
    }
    if (!signText) {
      alert("Please enter your signature text");
      return;
    }
    setIsSigningComplete(true);
    alert("Document signed successfully!");
  };

  const resetDocument = () => {
    setFile(null);
    setPreviewUrl(null);
    setSignText("");
    setDroppedPosition(null);
    setIsSigningComplete(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4 h-screen overflow-hidden relative">
      {!previewUrl ? (
        <Card className="w-full max-w-xl p-9 shadow-lg border">
          <CardContent className="flex flex-col justify-center items-center gap-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to SnapSign
            </h1>
            <p className="text-gray-600 text-sm max-w-md">
              Sign and manage documents effortlessly.
            </p>

            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button asChild variant="outline" className="px-6 py-2 mt-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2"
              >
                <FileIcon className="h-4 w-4" />
                Select a PDF to Sign
              </label>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragEnd={handleDragEnd}
        >
          <div className="container mx-auto h-full overflow-hidden relative grid grid-cols-12 gap-4">
            <PdfPanel
              previewUrl={previewUrl}
              droppedPosition={droppedPosition}
              setDroppedPosition={setDroppedPosition}
              isSigningComplete={isSigningComplete}
            />
            <SignPanel
              sign={signText}
              setSign={setSignText}
              onSign={handleSignDocument}
              isSigningComplete={isSigningComplete}
              onReset={resetDocument}
              isDropped={!!droppedPosition}
            />
          </div>
        </DndContext>
      )}
    </div>
  );
};

export default Home;
