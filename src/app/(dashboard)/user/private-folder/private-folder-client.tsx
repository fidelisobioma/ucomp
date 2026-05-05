"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import StorageMeter from "@/components/dashboard/storage-meter";
import FileCard from "@/components/dashboard/file-card";
import { toast } from "sonner";

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

interface PrivateFolderClientProps {
  initialFiles: File[];
  storageUsed: number;
  storageLimit: number;
}

export default function PrivateFolderClient({
  initialFiles,
  storageUsed,
  storageLimit,
}: PrivateFolderClientProps) {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [currentStorageUsed, setCurrentStorageUsed] = useState(storageUsed);

  function handleDelete(fileId: string) {
    const deletedFile = files.find((f) => f.id === fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (deletedFile) {
      setCurrentStorageUsed((prev) => prev - deletedFile.size);
    }
  }

  function handleMoveToQueue(fileId: string) {
    // File stays in private folder, just notify user
    toast.info("File moved to print queue successfully.");
  }

  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-bold text-slate-900 text-2xl">Private Folder</h2>
        <p className="mt-1 text-slate-500">
          Upload and manage your private documents
        </p>
      </div>

      {/* Storage Meter */}
      <StorageMeter
        storageUsed={currentStorageUsed}
        storageLimit={storageLimit}
      />

      {/* Upload Area */}
      {currentStorageUsed < storageLimit && (
        <div className="bg-white p-4 border rounded-lg">
          <h3 className="mb-3 font-medium text-slate-700 text-sm">
            Upload Documents
          </h3>
          <UploadDropzone
            endpoint="privateUploader"
            config={{ mode: "auto" }}
            onClientUploadComplete={(res) => {
              if (res) {
                window.location.reload();
              }
            }}
            onUploadError={(error) => {
              toast.error(error.message ?? "Upload failed. Please try again.");
            }}
          />
        </div>
      )}

      {/* Files List */}
      <div>
        <h3 className="mb-3 font-medium text-slate-700 text-sm">
          Your Documents ({files.length})
        </h3>
        {files.length === 0 ? (
          <div className="bg-white py-12 border rounded-lg text-center">
            <p className="text-slate-500 text-sm">
              No documents yet. Upload your first document above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={handleDelete}
                onMoveToQueue={handleMoveToQueue}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
