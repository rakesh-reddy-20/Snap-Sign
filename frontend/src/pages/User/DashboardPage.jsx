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
import { Toaster, toast } from "react-hot-toast";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";

import "@react-pdf-viewer/core/lib/styles/index.css";
import SignPanel from "@/components/layouts/SignPanel";
import PdfPanel from "@/components/layouts/PdfPanel";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";

const Home = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [signText, setSignText] = useState("");
  const [droppedPosition, setDroppedPosition] = useState(null);
  const [isSigningComplete, setIsSigningComplete] = useState(false);
  const [hasDropped, setHasDropped] = useState(false);
  const [pdfViewerRect, setPdfViewerRect] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));
  const { user } = useContext(UserContext);

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
    if (!over || active.id !== "signature") return;

    if (hasDropped && droppedPosition) {
      setDroppedPosition((prev) => ({
        ...prev,
        x: Math.max(0, prev.x + delta.x),
        y: Math.max(0, prev.y + delta.y),
      }));
    } else if (active.rect?.current?.translated && over.rect) {
      const rect = active.rect.current.translated;
      const dropX = rect.left;
      const dropY = rect.top;

      const containerRect = over.rect;
      const relativeX = dropX - containerRect.left;
      const relativeY = dropY - containerRect.top;

      setDroppedPosition({
        x: Math.max(0, relativeX),
        y: Math.max(0, relativeY),
        text: signText,
      });

      setPdfViewerRect(containerRect);
      setHasDropped(true);
    }
  };

  const handleSignDocument = async () => {
    if (!file || !droppedPosition || !signText || !pdfViewerRect) {
      toast.error("Please complete all steps before signing.");
      return;
    }

    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const viewerWidth = pdfViewerRect.width;
      const viewerHeight = pdfViewerRect.height;

      const clampedX = Math.max(0, Math.min(droppedPosition.x, viewerWidth));
      const clampedY = Math.max(0, Math.min(droppedPosition.y, viewerHeight));

      const pdfY = height * (clampedY / viewerHeight);
      const y = height - pdfY;
      const x = width * (clampedX / viewerWidth);

      firstPage.drawText(signText, {
        x,
        y,
        size: 18,
        font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const signedBlob = new Blob([pdfBytes], { type: "application/pdf" });

      const formData = new FormData();
      formData.append("pdf", signedBlob, file.name || "signed-document.pdf");

      const uploadRes = await axiosInstance.post(
        API_PATHS.UPLOAD.UPLOAD_DOC,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const fileUrl = uploadRes.data?.url;
      if (!fileUrl) throw new Error("Upload failed");
      if (!user || !user._id) {
        toast.error("User not found. Please login again.");
        return;
      }
      // 4. Call metadata store API
      const docMetadata = {
        title: file.name,
        fileUrl,
        owner: user._id,
        signedBy: user._id,
        signature: signText,
        isSigned: true,
      };

      await axiosInstance.post(API_PATHS.DOC.STORE_DOC, docMetadata, {
        withCredentials: true,
      });

      // 5. Download + Success
      const localUrl = URL.createObjectURL(signedBlob);
      const a = document.createElement("a");
      a.href = localUrl;
      a.download = "signed-document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(localUrl);

      setIsSigningComplete(true);
      toast.success("Document signed, uploaded, and saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during signing.");
    }
  };

  const resetDocument = () => {
    setFile(null);
    setPreviewUrl(null);
    setSignText("");
    setDroppedPosition(null);
    setPdfViewerRect(null);
    setHasDropped(false);
    setIsSigningComplete(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gray-50 px-4 h-screen">
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
                setPdfViewerRect={setPdfViewerRect}
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
    </>
  );
};

export default Home;
