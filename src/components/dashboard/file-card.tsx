"use client";

import { useState } from "react";
import { FileText, Image, Trash2, MoveRight, FileIcon } from "lucide-react";
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
    return <Image className="w-8 h-8 text-blue-500" />;
  }
  if (type === "PDF") {
    return <FileText className="w-8 h-8 text-red-500" />;
  }
  return <FileIcon className="w-8 h-8 text-slate-500" />;
}

export default function FileCard({
  file,
  onDelete,
  onMoveToQueue,
}: FileCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
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
    setIsMoving(true);
    try {
      const response = await fetch(`/api/files/${file.id}/move-to-queue`, {
        method: "POST",
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
    }
  }

  return (
    <>
      <div className="flex justify-between items-center bg-white hover:shadow-sm p-4 border rounded-lg transition-shadow">
        <div className="flex items-center gap-3">
          <FileTypeIcon type={file.type} />
          <div>
            <p className="max-w-[200px] font-medium text-slate-900 text-sm truncate">
              {file.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-xs">
                {file.type}
              </Badge>
              <span className="text-slate-400 text-xs">
                {formatBytes(file.size)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowMoveDialog(true)}
          >
            <MoveRight className="w-3.5 h-3.5" />
            Move to Queue
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-50 text-red-500 hover:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">{file.name}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
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
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Print Queue</DialogTitle>
            <DialogDescription>
              Move{" "}
              <span className="font-medium text-slate-900">{file.name}</span> to
              the print queue? Admins will be notified and can print it. The
              document will auto-delete from the queue after 24 hours.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMoveDialog(false)}
              disabled={isMoving}
            >
              Cancel
            </Button>
            <Button onClick={handleMoveToQueue} disabled={isMoving}>
              {isMoving ? "Moving..." : "Move to Queue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
