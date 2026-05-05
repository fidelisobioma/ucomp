"use client";

import { useState } from "react";
import { FileText, Image, Trash2, FileIcon, PrinterIcon } from "lucide-react";
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
import ExpiryTimer from "@/components/dashboard/expiry-timer";

interface QueueItem {
  id: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  };
  printLogs: {
    copies: number;
    printedAt: Date;
  }[];
}

interface UserPrintQueueClientProps {
  initialQueueItems: QueueItem[];
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

export default function UserPrintQueueClient({
  initialQueueItems,
}: UserPrintQueueClientProps) {
  const [queueItems, setQueueItems] = useState<QueueItem[]>(initialQueueItems);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!selectedItem) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/print-queue/${selectedItem.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to remove from queue.");
        return;
      }

      setQueueItems((prev) =>
        prev.filter((item) => item.id !== selectedItem.id),
      );
      toast.success("Document removed from print queue.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
      setSelectedItem(null);
    }
  }

  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-bold text-slate-900 text-2xl">Print Queue</h2>
        <p className="mt-1 text-slate-500">Documents queued for printing</p>
      </div>

      {/* Queue Items */}
      {queueItems.length === 0 ? (
        <div className="bg-white py-12 border rounded-lg text-center">
          <PrinterIcon className="mx-auto mb-3 w-10 h-10 text-slate-300" />
          <p className="text-slate-500 text-sm">
            No documents in queue. Move documents from your private folder to
            print them.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {queueItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white hover:shadow-sm p-4 border rounded-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <FileTypeIcon type={item.file.type} />
                <div>
                  <p className="max-w-[200px] font-medium text-slate-900 text-sm truncate">
                    {item.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs">
                      {item.file.type}
                    </Badge>
                    {item.printLogs.length > 0 && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Printed {item.printLogs[0].copies} cop(ies)
                      </Badge>
                    )}
                  </div>
                  <ExpiryTimer expiresAt={item.expiresAt} />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-50 text-red-500 hover:text-red-600"
                onClick={() => setSelectedItem(item)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Queue</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium text-slate-900">
                {selectedItem?.file.name}
              </span>{" "}
              from the print queue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedItem(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
