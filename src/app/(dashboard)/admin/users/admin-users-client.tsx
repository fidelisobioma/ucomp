"use client";

import { useRouter } from "next/navigation";
import { Users, PrinterIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  _count: {
    printQueueItems: number;
  };
}

interface AdminUsersClientProps {
  users: User[];
}

export default function AdminUsersClient({ users }: AdminUsersClientProps) {
  const router = useRouter();

  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-bold text-slate-900 text-2xl">Users</h2>
        <p className="mt-1 text-slate-500">
          All registered users — click a user to view their print queue
        </p>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="bg-white py-12 border rounded-lg text-center">
          <Users className="mx-auto mb-3 w-10 h-10 text-slate-300" />
          <p className="text-slate-500 text-sm">No registered users yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center bg-white hover:shadow-sm p-4 border rounded-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-slate-100 rounded-full w-9 h-9 font-medium text-slate-700 text-sm">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">
                    {user.name ?? "Unnamed User"}
                  </p>
                  <p className="text-slate-500 text-xs">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user._count.printQueueItems > 0 && (
                  <Badge className="gap-1.5 bg-amber-100 text-amber-700">
                    <PrinterIcon className="w-3 h-3" />
                    {user._count.printQueueItems} pending
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/admin/print-queue/${user.id}`)}
                >
                  View Queue
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
