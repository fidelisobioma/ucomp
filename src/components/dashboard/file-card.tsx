"use client";

import { useState } from "react";
import {
  FileText,
  Image,
  Trash2,
  MoveRight,
  FileIcon,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import AdminPicker from "@/components/dashboard/admin-picker";
import FilePreview from "@/components/dashboard/file-preview";
import { truncateFileName } from "@/lib/utils";

interface FileCardProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    createdAt: Date;
  };
  onDelete: (fileId: string) => void;
  onMoveToQueue: (fileId: string) => void;
}

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${mb.toFixed(1)} MB`;
}

function FileTypeIcon({ type }: { type: string }) {
  if (type === "JPG" || type === "PNG") {
    return <Image className="w-7 sm:w-8 h-7 sm:h-8 text-blue-500" />;
  }
  if (type === "PDF") {
    return <FileText className="w-7 sm:w-8 h-7 sm:h-8 text-red-500" />;
  }
  return <FileIcon className="w-7 sm:w-8 h-7 sm:h-8 text-slate-500" />;
}

export default function FileCard({
  file,
  onDelete,
  onMoveToQueue,
}: FileCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        toast.error("Failed to delete file. Please try again.");
        return;
      }
      toast.success("File deleted successfully.");
      onDelete(file.id);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  async function handleMoveToQueue() {
    if (!selectedAdminId) {
      toast.error("Please select an admin first.");
      return;
    }
    setIsMoving(true);
    try {
      const response = await fetch(`/api/files/${file.id}/move-to-queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedAdminId: selectedAdminId }),
      });
      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error ?? "Failed to move file to queue.");
        return;
      }
      toast.success("File moved to print queue.");
      onMoveToQueue(file.id);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsMoving(false);
      setShowMoveDialog(false);
      setSelectedAdminId(null);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center gap-2 bg-white hover:shadow-sm p-3 sm:p-4 border rounded-lg w-full overflow-hidden transition-shadow">
        {/* Left — Icon + Info */}
        <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
          <div className="shrink-0">
            <FileTypeIcon type={file.type} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 text-sm truncate">
              {truncateFileName(file.name)}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <Badge variant="secondary" className="text-xs shrink-0">
                {file.type}
              </Badge>
              <span className="text-slate-400 text-xs shrink-0">
                {formatBytes(file.size)}
              </span>
            </div>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 sm:w-9 h-8 sm:h-9"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-500" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 px-2 sm:px-3 h-8 text-xs sm:text-sm"
            onClick={() => setShowMoveDialog(true)}
          >
            <MoveRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span className="hidden sm:inline">Move to Queue</span>
            <span className="sm:hidden">Queue</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-50 w-8 sm:w-9 h-8 sm:h-9 text-red-500 hover:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* File Preview */}
      <FilePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        file={file}
      />

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-xl max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">
                {truncateFileName(file.name)}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to Queue Dialog */}
      <Dialog
        open={showMoveDialog}
        onOpenChange={(open) => {
          setShowMoveDialog(open);
          if (!open) setSelectedAdminId(null);
        }}
      >
        <DialogContent className="rounded-xl max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move to Print Queue</DialogTitle>
            <DialogDescription>
              Select an admin to send{" "}
              <span className="font-medium text-slate-900">
                {truncateFileName(file.name)}
              </span>{" "}
              to.
            </DialogDescription>
          </DialogHeader>
          <AdminPicker
            selectedAdminId={selectedAdminId}
            onSelect={setSelectedAdminId}
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowMoveDialog(false);
                setSelectedAdminId(null);
              }}
              disabled={isMoving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMoveToQueue}
              disabled={isMoving || !selectedAdminId}
            >
              {isMoving ? "Moving..." : "Move to Queue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
