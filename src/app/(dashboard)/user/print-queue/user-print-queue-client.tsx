"use client";

import { useState } from "react";
import {
  FileText,
  Image,
  Trash2,
  FileIcon,
  PrinterIcon,
  RefreshCw,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ExpiryTimer from "@/components/dashboard/expiry-timer";
import AdminPicker from "@/components/dashboard/admin-picker";
import PrintDialog from "@/components/dashboard/print-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilePreview from "@/components/dashboard/file-preview";
import { Eye } from "lucide-react";
import { truncateFileName } from "@/lib/utils";
interface QueueItem {
  id: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  assignedAdmin: {
    id: string;
    name: string | null;
    email: string;
  } | null;
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
  role: string;
}

function FileTypeIcon({ type }: { type: string }) {
  if (type === "JPG" || type === "PNG")
    return <Image className="w-8 h-8 text-blue-500" />;
  if (type === "PDF") return <FileText className="w-8 h-8 text-red-500" />;
  return <FileIcon className="w-8 h-8 text-slate-500" />;
}

function isExpired(expiresAt: Date): boolean {
  return new Date(expiresAt) < new Date();
}

export default function UserPrintQueueClient({
  initialQueueItems,
  role,
}: UserPrintQueueClientProps) {
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  const [queueItems, setQueueItems] = useState<QueueItem[]>(
    initialQueueItems.filter((item) => !isExpired(item.expiresAt)),
  );
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [reassignItem, setReassignItem] = useState<QueueItem | null>(null);
  const [printItem, setPrintItem] = useState<QueueItem | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copies, setCopies] = useState("1");
  const [printTarget, setPrintTarget] = useState<QueueItem | null>(null);
  const [previewFile, setPreviewFile] = useState<QueueItem["file"] | null>(
    null,
  );

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

  async function handleReassign() {
    if (!reassignItem || !selectedAdminId) return;
    setIsReassigning(true);
    try {
      const response = await fetch(
        `/api/print-queue/${reassignItem.id}/reassign`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newAdminId: selectedAdminId }),
        },
      );
      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error ?? "Failed to reassign.");
        return;
      }
      toast.success("Document reassigned successfully.");
      // Refresh page to get updated admin info
      window.location.reload();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsReassigning(false);
      setReassignItem(null);
      setSelectedAdminId(null);
    }
  }

  async function handlePrint() {
    if (!printItem) return;
    setIsPrinting(true);
    try {
      const response = await fetch(`/api/print-queue/${printItem.id}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copies: parseInt(copies) }),
      });
      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error ?? "Failed to mark as printed.");
        return;
      }
      toast.success(`Document marked as printed — ${copies} cop(ies).`);
      setQueueItems((prev) =>
        prev.map((item) =>
          item.id === printItem.id
            ? {
                ...item,
                status: "PRINTED",
                printLogs: [
                  { copies: parseInt(copies), printedAt: new Date() },
                  ...item.printLogs,
                ],
              }
            : item,
        ),
      );
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsPrinting(false);
      setPrintItem(null);
      setCopies("1");
    }
  }

  function cn(...classes: (string | undefined | boolean)[]): string {
    return classes
      .filter((c) => typeof c === "string" && c.length > 0)
      .join(" ");
  }

  function setDeleteTarget(item: QueueItem): void {
    // Open the delete confirmation dialog for the selected item
    setSelectedItem(item);
  }

  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      <div>
        <h2 className="font-bold text-slate-900 text-2xl">
          {isAdmin ? "My Print Queue" : "Print Queue"}
        </h2>
        <p className="mt-1 text-slate-500">Documents queued for printing</p>
      </div>

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
              className="flex justify-between items-center gap-2 bg-white hover:shadow-sm p-3 sm:p-4 border rounded-lg w-full overflow-hidden transition-shadow"
            >
              {/* Left — Icon + Info */}
              <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
                <div className="shrink-0">
                  <FileTypeIcon type={item.file.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">
                    {truncateFileName(item.file.name)}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {item.file.type}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-xs shrink-0",
                        item.status === "PRINTED"
                          ? "bg-green-100 text-green-700"
                          : item.status === "EXPIRED"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700",
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <ExpiryTimer expiresAt={item.expiresAt} />
                </div>
              </div>

              {/* Right — Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setPreviewFile(item.file)}
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                </Button>
                {!isExpired(item.expiresAt) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-50 w-8 h-8 text-red-500 hover:text-red-600"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
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

      {/* Reassign Dialog */}
      <Dialog
        open={!!reassignItem}
        onOpenChange={(open) => {
          if (!open) {
            setReassignItem(null);
            setSelectedAdminId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Document</DialogTitle>
            <DialogDescription>
              Select a new admin to send{" "}
              <span className="font-medium text-slate-900">
                {reassignItem?.file.name}
              </span>{" "}
              to.
            </DialogDescription>
          </DialogHeader>
          <AdminPicker
            selectedAdminId={selectedAdminId}
            onSelect={setSelectedAdminId}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReassignItem(null);
                setSelectedAdminId(null);
              }}
              disabled={isReassigning}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReassign}
              disabled={isReassigning || !selectedAdminId}
            >
              {isReassigning ? "Reassigning..." : "Reassign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Dialog — Admin Only */}
      <Dialog
        open={!!printItem}
        onOpenChange={() => {
          setPrintItem(null);
          setCopies("1");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Printed</DialogTitle>
            <DialogDescription>
              How many copies of{" "}
              <span className="font-medium text-slate-900">
                {printItem?.file.name}
              </span>{" "}
              were printed?
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <label className="font-medium text-slate-700 text-sm">
              Number of copies
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              value={copies}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 100) {
                  toast.error("Maximum copies allowed is 100.");
                  setCopies("100");
                  return;
                }
                setCopies(e.target.value);
              }}
              className="mt-1.5"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPrintItem(null);
                setCopies("1");
              }}
              disabled={isPrinting}
            >
              Cancel
            </Button>
            <Button onClick={handlePrint} disabled={isPrinting}>
              <PrinterIcon className="mr-1.5 w-3.5 h-3.5" />
              {isPrinting ? "Marking..." : "Mark as Printed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview */}
      {previewFile && (
        <FilePreview
          open={!!previewFile}
          onOpenChange={(open) => {
            if (!open) setPreviewFile(null);
          }}
          file={previewFile}
        />
      )}

      {printTarget && (
        <PrintDialog
          open={!!printTarget}
          onOpenChange={(open) => {
            if (!open) setPrintTarget(null);
          }}
          file={printTarget.file}
          queueItemId={printTarget.id}
          onPrinted={(copies) => {
            setQueueItems((prev) =>
              prev.map((item) =>
                item.id === printTarget.id
                  ? {
                      ...item,
                      status: "PRINTED",
                      printLogs: [
                        { copies, printedAt: new Date() },
                        ...item.printLogs,
                      ],
                    }
                  : item,
              ),
            );
            setPrintTarget(null);
          }}
        />
      )}
    </div>
  );
}
