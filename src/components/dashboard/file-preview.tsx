"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface FilePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    name: string;
    type: string;
    url: string;
  };
}

export default function FilePreview({
  open,
  onOpenChange,
  file,
}: FilePreviewProps) {
  const isImage = file.type === "JPG" || file.type === "PNG";
  const isPDF = file.type === "PDF";
  const isDocx = file.type === "DOCX";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col w-full max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="truncate">{file.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 justify-center items-center bg-slate-50 border rounded-lg min-h-[400px] overflow-hidden">
          {isImage && (
            <img
              src={file.url}
              alt={file.name}
              className="rounded max-w-full max-h-[60vh] object-contain"
            />
          )}

          {isPDF && (
            <iframe
              src={file.url}
              className="rounded w-full h-[60vh]"
              title={file.name}
            />
          )}

          {isDocx && (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <FileText className="w-16 h-16 text-slate-300" />
              <div>
                <p className="font-medium text-slate-700">
                  Preview not available for Word documents
                </p>
                <p className="mt-1 text-slate-500 text-sm">
                  Download the file to view it in Microsoft Word or Google Docs
                </p>
              </div>
              <Button asChild>
                <a href={file.url} download={file.name} target="_blank">
                  <Download className="mr-2 w-4 h-4" />
                  Download to View
                </a>
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" asChild>
            <a href={file.url} download={file.name} target="_blank">
              <Download className="mr-2 w-4 h-4" />
              Download
            </a>
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
