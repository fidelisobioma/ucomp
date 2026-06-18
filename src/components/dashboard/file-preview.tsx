"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { truncateFileName } from "@/lib/utils";

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
          <DialogTitle className="max-w-[280px] sm:max-w-full text-sm sm:text-base truncate">
            {truncateFileName(file.name, 30)}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 justify-center items-center bg-slate-50 border rounded-lg min-h-[400px] overflow-hidden">
          {isImage && (
            <div className="relative w-full h-[60vh]">
              <Image
                src={file.url}
                alt={file.name}
                fill
                className="rounded object-contain"
              />
            </div>
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
                  Please print the document to view its contents
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
