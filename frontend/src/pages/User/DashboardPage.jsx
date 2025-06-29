import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileIcon, ArrowLeftIcon } from "lucide-react";

import "@react-pdf-viewer/core/lib/styles/index.css";
import PdfPanel from "@/components/layouts/PdfPanel";
import SignPanel from "@/components/layouts/SignPanel";

const Home = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4 h-screen overflow-hidden">
      {!previewUrl ? (
        <Card className="w-full max-w-xl p-9 shadow-lg border border-gray-200">
          <CardContent className="flex flex-col justify-center items-center gap-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to SnapSign
            </h1>
            <p className="text-gray-600 text-sm max-w-md">
              Sign, share, and manage documents effortlessly. <br />
              SnapSign is your digital signature partner.
            </p>

            {/* Hidden file input */}
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              asChild
              variant="outline"
              className="px-6 py-2 text-sm w-full sm:w-auto mt-4"
            >
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
        <div className="container mx-auto h-full overflow-hidden ">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* 8-column PDF preview */}
            <PdfPanel previewUrl={previewUrl} />
            {/* 4-column sidebar */}
            <SignPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
