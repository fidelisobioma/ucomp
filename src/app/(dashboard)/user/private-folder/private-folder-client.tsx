"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import StorageMeter from "@/components/dashboard/storage-meter";
import FileCard from "@/components/dashboard/file-card";
import { toast } from "sonner";
import { HardDrive } from "lucide-react";

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
  plan: string;
}

export default function PrivateFolderClient({
  initialFiles,
  storageUsed,
  storageLimit,
  plan,
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
    toast.info("File moved to print queue successfully.");
  }

  return (
    <div className="space-y-4 mx-auto px-0 sm:px-0 w-full max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-bold text-slate-900 text-xl sm:text-2xl">
          Private Folder
        </h2>
        <p className="mt-1 text-slate-500 text-sm">
          Upload and manage your private documents
        </p>
      </div>

      {/* Storage Meter */}
      <div className="bg-white p-4 border rounded-lg w-full overflow-hidden">
        <StorageMeter
          storageUsed={currentStorageUsed}
          storageLimit={storageLimit}
        />
      </div>

      {/* Upload Area */}
      {currentStorageUsed >= storageLimit ? (
        <div className="bg-amber-50 p-4 sm:p-6 border border-amber-200 rounded-lg w-full overflow-hidden text-center">
          <HardDrive className="mx-auto mb-3 w-8 sm:w-10 h-8 sm:h-10 text-amber-500" />
          <h3 className="mb-1 font-semibold text-slate-900 text-sm sm:text-base">
            Storage Full
          </h3>
          <p className="mb-4 text-slate-600 text-xs sm:text-sm">
            You have used all your{" "}
            {plan === "FREE"
              ? "20MB free"
              : plan === "PREMIUM"
                ? "1GB Premium"
                : "5GB Max"}{" "}
            storage. Upgrade your plan to upload more documents.
          </p>
          <div className="flex flex-col gap-2 mx-auto w-full max-w-xs">
            <div className="bg-white p-3 border rounded-lg text-left">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900 text-sm">Premium</p>
                  <p className="text-slate-500 text-xs">1GB storage</p>
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  ₦2,500/mo
                </span>
              </div>
            </div>
            <div className="bg-white p-3 border rounded-lg text-left">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900 text-sm">Max</p>
                  <p className="text-slate-500 text-xs">5GB storage</p>
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  ₦8,000/mo
                </span>
              </div>
            </div>
            <p className="mt-1 text-slate-500 text-xs">
              Contact us to upgrade your plan and start uploading again.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-3 sm:p-4 border rounded-lg w-full overflow-hidden">
          <h3 className="mb-3 font-medium text-slate-700 text-sm">
            Upload Documents
          </h3>
          <div className="w-full overflow-hidden">
            <UploadDropzone
              endpoint="privateUploader"
              config={{ mode: "auto" }}
              onClientUploadComplete={(res) => {
                if (res) {
                  window.location.reload();
                }
              }}
              onUploadError={(error) => {
                toast.error(
                  error.message ?? "Upload failed. Please try again.",
                );
              }}
            />
          </div>
        </div>
      )}

      {/* Files List */}
      <div className="w-full">
        <h3 className="mb-3 font-medium text-slate-700 text-sm">
          Your Documents ({files.length})
        </h3>
        {files.length === 0 ? (
          <div className="bg-white py-10 sm:py-12 border rounded-lg w-full text-center">
            <p className="px-4 text-slate-500 text-sm">
              No documents yet. Upload your first document above.
            </p>
          </div>
        ) : (
          <div className="space-y-2 w-full">
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
