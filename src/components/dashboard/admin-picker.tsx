"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2, ShieldCheck } from "lucide-react";

interface Admin {
  id: string;
  name: string | null;
  email: string;
  role: string;
  _count: {
    assignedQueueItems: number;
  };
}

interface AdminPickerProps {
  selectedAdminId: string | null;
  onSelect: (adminId: string) => void;
}

export default function AdminPicker({
  selectedAdminId,
  onSelect,
}: AdminPickerProps) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const response = await fetch("/api/admins");
        if (!response.ok) return;
        const data = await response.json();
        setAdmins(data.admins);
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdmins();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="py-6 text-center">
        <ShieldCheck className="mx-auto mb-2 w-8 h-8 text-slate-300" />
        <p className="text-slate-500 text-sm">
          No admins available at the moment.
        </p>
        <p className="mt-1 text-slate-400 text-xs">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {admins.map((admin) => (
        <button
          key={admin.id}
          onClick={() => onSelect(admin.id)}
          className={cn(
            "flex justify-between items-center p-3 border rounded-lg w-full text-left transition-colors",
            selectedAdminId === admin.id
              ? "border-slate-900 bg-slate-50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-slate-100 rounded-full w-8 h-8 font-medium text-slate-700 text-sm">
              {admin.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">
                {admin.name ?? "Admin"}
              </p>
              <p className="text-slate-500 text-xs">{admin.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                admin._count.assignedQueueItems > 5
                  ? "bg-red-100 text-red-700"
                  : admin._count.assignedQueueItems > 2
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700",
              )}
            >
              {admin._count.assignedQueueItems} pending
            </Badge>
            {admin.role === "SUPERADMIN" && (
              <Badge className="bg-blue-100 text-blue-700 text-xs">Super</Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
