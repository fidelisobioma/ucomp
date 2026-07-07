import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import QRCodeClient from "./qr-code-client";

export default async function QRCodePage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role: string }).role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/dashboard");

  return (
    <div className="space-y-6 mx-auto max-w-2xl">
      <div>
        <h2 className="font-bold text-slate-900 text-2xl">QR Code</h2>
        <p className="mt-1 text-slate-500">
          Print this QR code and place it on your wall for customers to scan
        </p>
      </div>
      <QRCodeClient />
    </div>
  );
}
