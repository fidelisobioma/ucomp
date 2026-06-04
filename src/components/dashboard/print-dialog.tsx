"use client";

import { useState } from "react";
import { PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

interface PrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    id: string;
    name: string;
    type: string;
  };
  queueItemId: string;
  onPrinted: (copies: number) => void;
}

const PAPER_SIZES = [
  { value: "A4", label: "A4 (210×297mm)" },
  { value: "A3", label: "A3 (297×420mm)" },
  { value: "LETTER", label: "Letter (216×279mm)" },
  { value: "LEGAL", label: "Legal (216×356mm)" },
  { value: "PASSPORT", label: "Passport Photo — 8 per 4×6 sheet" },
  { value: "ID_CARD", label: "ID Card — Single (85.6×54mm)" },
];

const IMAGE_TYPES = ["JPG", "PNG"];

export default function PrintDialog({
  open,
  onOpenChange,
  file,
  queueItemId,
  onPrinted,
}: PrintDialogProps) {
  const [paperSize, setPaperSize] = useState("A4");
  const [copies, setCopies] = useState("1");
  const [isPrinting, setIsPrinting] = useState(false);

  // Only show passport/ID sizes for images
  const availableSizes = IMAGE_TYPES.includes(file.type)
    ? PAPER_SIZES
    : PAPER_SIZES.filter(
        (s) => s.value !== "PASSPORT" && s.value !== "ID_CARD",
      );

  async function handlePrint() {
    setIsPrinting(true);
    try {
      // Open print window
      const printUrl = `/api/print?fileId=${file.id}&paperSize=${paperSize}`;
      const printWindow = window.open(
        printUrl,
        "_blank",
        "width=800,height=600",
      );

      if (!printWindow) {
        toast.error("Please allow popups for this site to enable printing.");
        setIsPrinting(false);
        return;
      }

      // Mark as printed after window opens
      const response = await fetch(`/api/print-queue/${queueItemId}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copies: parseInt(copies) }),
      });

      if (!response.ok) {
        toast.error("Failed to mark as printed.");
        return;
      }

      toast.success(
        `Printing ${file.name} — ${copies} cop(ies) on ${
          PAPER_SIZES.find((s) => s.value === paperSize)?.label
        }`,
      );

      onPrinted(parseInt(copies));
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsPrinting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Print Document</DialogTitle>
          <DialogDescription>
            Select paper size and number of copies for{" "}
            <span className="font-medium text-slate-900">{file.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Paper Size */}
          <div className="space-y-2">
            <FieldLabel>Paper Size</FieldLabel>
            <div className="gap-2 grid grid-cols-1">
              {availableSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setPaperSize(size.value)}
                  className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    paperSize === size.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Copies */}
          <Field>
            <FieldLabel>Number of Copies</FieldLabel>
            <Input
              type="number"
              min="1"
              max="100"
              value={copies}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 100) {
                  toast.error("Maximum 100 copies allowed.");
                  setCopies("100");
                  return;
                }
                setCopies(e.target.value);
              }}
            />
          </Field>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPrinting}
          >
            Cancel
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting} className="gap-2">
            <PrinterIcon className="w-4 h-4" />
            {isPrinting ? "Opening..." : "Print"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
