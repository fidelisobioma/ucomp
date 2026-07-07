"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

const WELCOME_URL = "https://ucomp.vercel.app/welcome";

export default function QRCodeClient() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function generateQR() {
      try {
        const dataUrl = await QRCode.toDataURL(WELCOME_URL, {
          width: 400,
          margin: 2,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    }
    generateQR();
  }, []);

  function handleDownload() {
    const link = document.createElement("a");
    link.download = "ucomp-qr-code.png";
    link.href = qrDataUrl;
    link.click();
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ucomp QR Code</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            text-align: center;
          }
          img { width: 300px; height: 300px; }
          h1 { font-size: 32px; font-weight: bold; margin: 16px 0 8px; color: #0f172a; }
          p { font-size: 16px; color: #64748b; margin: 4px 0; }
          .url { font-size: 12px; color: #94a3b8; margin-top: 12px; }
        </style>
      </head>
      <body>
        <img src="${qrDataUrl}" alt="Ucomp QR Code" />
        <h1>Scan to Print</h1>
        <p>Upload your documents and queue them for printing</p>
        <p>Fast • Private • Secure</p>
        <p class="url">${WELCOME_URL}</p>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <div className="flex flex-col items-center gap-6 bg-white p-8 border rounded-2xl">
        {qrDataUrl ? (
          <>
            <div className="bg-white shadow-sm p-4 border-2 border-slate-100 rounded-xl">
              <img src={qrDataUrl} alt="Ucomp QR Code" className="w-64 h-64" />
            </div>

            <div className="text-center">
              <p className="font-semibold text-slate-900">
                Scan to visit Ucomp
              </p>
              <p className="mt-1 text-slate-500 text-sm">{WELCOME_URL}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
              <Button className="gap-2" onClick={handlePrint}>
                <Printer className="w-4 h-4" />
                Print QR Code
              </Button>
            </div>
          </>
        ) : (
          <div className="bg-slate-100 rounded-xl w-64 h-64 animate-pulse" />
        )}
      </div>

      {/* Instructions */}
      <div className="space-y-3 bg-slate-50 p-6 border rounded-xl">
        <h3 className="font-semibold text-slate-900">How to use</h3>
        <ol className="space-y-2 text-slate-600 text-sm list-decimal list-inside">
          <li>
            Click <strong>Print QR Code</strong> to open the print dialog
          </li>
          <li>Print on A4 paper</li>
          <li>Laminate it for durability (optional but recommended)</li>
          <li>Stick it on your wall where customers can easily see it</li>
          <li>Customers scan it with their phone camera to access Ucomp</li>
        </ol>
      </div>
    </div>
  );
}
