"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2, User } from "lucide-react";

interface Admin {
  id: string;
  name: string | null;
  email: string;
  _count: { assignedQueueItems: number };
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
        const data = await response.json();
        setAdmins(data.admins);
      } catch {
        console.error("Failed to fetch admins");
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
      <p className="py-4 text-slate-500 text-sm text-center">
        No admins available.
      </p>
    );
  }

  return (
    <div className="space-y-2 pr-1 max-h-48 overflow-y-auto">
      {admins.map((admin) => (
        <button
          key={admin.id}
          onClick={() => onSelect(admin.id)}
          className={cn(
            "flex justify-between items-center p-2.5 border rounded-lg w-full text-left transition-colors",
            selectedAdminId === admin.id
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 hover:border-slate-300 bg-white",
          )}
        >
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <User
              className={cn(
                "w-4 h-4 shrink-0",
                selectedAdminId === admin.id ? "text-white" : "text-slate-400",
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {admin.name ?? "Admin"}
              </p>
              <p
                className={cn(
                  "text-xs truncate",
                  selectedAdminId === admin.id
                    ? "text-slate-300"
                    : "text-slate-400",
                )}
              >
                {admin.email}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "ml-2 text-xs shrink-0",
              selectedAdminId === admin.id ? "bg-white/20 text-white" : "",
            )}
          >
            {admin._count.assignedQueueItems} pending
          </Badge>
        </button>
      ))}
    </div>
  );
}
