"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image,
  FileIcon,
  PrinterIcon,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ExpiryTimer from "@/components/dashboard/expiry-timer";
import FilePreview from "@/components/dashboard/file-preview";
import PrintDialog from "@/components/dashboard/print-dialog";

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

function FileTypeIcon({ type }: { type: string }) {
  if (type === "JPG" || type === "PNG")
    return <Image className="w-8 h-8 text-blue-500" />;
  if (type === "PDF") return <FileText className="w-8 h-8 text-red-500" />;
  return <FileIcon className="w-8 h-8 text-slate-500" />;
}

function isExpired(expiresAt: Date): boolean {
  return new Date(expiresAt) < new Date();
}

export default function AdminPrintQueueClient({
  user,
  queueItems: initialQueueItems,
}: AdminPrintQueueClientProps) {
  const router = useRouter();
  const [queueItems, setQueueItems] = useState<QueueItem[]>(
    initialQueueItems.filter((item) => !isExpired(item.expiresAt)),
  );
  const [printTarget, setPrintTarget] = useState<QueueItem | null>(null);
  const [previewFile, setPreviewFile] = useState<QueueItem["file"] | null>(
    null,
  );

  function handlePrinted(queueItemId: string, copies: number) {
    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === queueItemId
          ? {
              ...item,
              status: "PRINTED",
              printLogs: [{ copies, printedAt: new Date() }, ...item.printLogs],
            }
          : item,
      ),
    );
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
                        Last: {item.printLogs[0].copies} cop(ies)
                      </Badge>
                    )}
                  </div>
                  <ExpiryTimer expiresAt={item.expiresAt} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewFile(item.file)}
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setPrintTarget(item)}
                >
                  <PrinterIcon className="w-3.5 h-3.5" />
                  Print
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Print Dialog */}
      {printTarget && (
        <PrintDialog
          open={!!printTarget}
          onOpenChange={(open) => {
            if (!open) setPrintTarget(null);
          }}
          file={printTarget.file}
          queueItemId={printTarget.id}
          onPrinted={(copies) => {
            handlePrinted(printTarget.id, copies);
            setPrintTarget(null);
          }}
        />
      )}

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
    </div>
  );
}
