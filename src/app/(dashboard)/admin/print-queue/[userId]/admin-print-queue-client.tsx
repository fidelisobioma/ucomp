"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image,
  FileIcon,
  PrinterIcon,
  ArrowLeft,
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
import { Input } from "@/components/ui/input";
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

interface AdminPrintQueueClientProps {
  user: { id: string; name: string | null; email: string };
  queueItems: QueueItem[];
}

function isExpired(expiresAt: Date): boolean {
  return new Date(expiresAt) < new Date();
}

function FileTypeIcon({ type }: { type: string }) {
  if (type === "JPG" || type === "PNG")
    return <Image className="w-8 h-8 text-blue-500" />;
  if (type === "PDF") return <FileText className="w-8 h-8 text-red-500" />;
  return <FileIcon className="w-8 h-8 text-slate-500" />;
}

export default function AdminPrintQueueClient({
  user,
  queueItems: initialQueueItems,
}: AdminPrintQueueClientProps) {
  const router = useRouter();

  const [queueItems, setQueueItems] = useState<QueueItem[]>(
    initialQueueItems.filter((item) => !isExpired(item.expiresAt)),
  );
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [copies, setCopies] = useState("1");
  const [isPrinting, setIsPrinting] = useState(false);

  async function handleMarkAsPrinted() {
    if (!selectedItem) return;
    setIsPrinting(true);

    try {
      const response = await fetch(
        `/api/print-queue/${selectedItem.id}/print`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ copies: parseInt(copies) }),
        },
      );

      if (!response.ok) {
        toast.error("Failed to mark as printed.");
        return;
      }

      toast.success(`Document marked as printed — ${copies} cop(ies).`);

      // Update queue items locally
      setQueueItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                printLogs: [
                  {
                    copies: parseInt(copies),
                    printedAt: new Date(),
                  },
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
      setSelectedItem(null);
      setCopies("1");
    }
  }

  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="font-bold text-slate-900 text-2xl">
            {user.name ?? "User"}&apos;s Print Queue
          </h2>
          <p className="mt-1 text-slate-500">{user.email}</p>
        </div>
      </div>

      {/* Queue Items */}
      {queueItems.length === 0 ? (
        <div className="bg-white py-12 border rounded-lg text-center">
          <PrinterIcon className="mx-auto mb-3 w-10 h-10 text-slate-300" />
          <p className="text-slate-500 text-sm">
            No documents in queue for this user.
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
                        Last printed: {item.printLogs[0].copies} cop(ies)
                      </Badge>
                    )}
                  </div>
                  <ExpiryTimer expiresAt={item.expiresAt} />
                </div>
              </div>

              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => setSelectedItem(item)}
              >
                <PrinterIcon className="w-3.5 h-3.5" />
                Print
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Print Dialog */}
      <Dialog
        open={!!selectedItem}
        onOpenChange={() => {
          setSelectedItem(null);
          setCopies("1");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Printed</DialogTitle>
            <DialogDescription>
              How many copies of{" "}
              <span className="font-medium text-slate-900">
                {selectedItem?.file.name}
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
                setSelectedItem(null);
                setCopies("1");
              }}
              disabled={isPrinting}
            >
              Cancel
            </Button>
            <Button onClick={handleMarkAsPrinted} disabled={isPrinting}>
              <PrinterIcon className="mr-1.5 w-3.5 h-3.5" />
              {isPrinting ? "Marking..." : "Mark as Printed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
