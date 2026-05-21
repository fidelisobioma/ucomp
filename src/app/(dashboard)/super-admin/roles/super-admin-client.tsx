"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldMinus, HardDrive, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan: string;
  storageLimit: number;
  storageUsed: number;
  createdAt: Date;
}

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(0)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

export default function SuperAdminClient({
  users: initialUsers,
}: {
  users: User[];
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roleTarget, setRoleTarget] = useState<User | null>(null);
  const [storageTarget, setStorageTarget] = useState<User | null>(null);
  const [storageLimitMB, setStorageLimitMB] = useState("");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isUpdatingStorage, setIsUpdatingStorage] = useState(false);
  const [planTarget, setPlanTarget] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("PREMIUM");
  const [durationMonths, setDurationMonths] = useState("1");
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

  async function handleRoleChange() {
    if (!roleTarget) return;
    setIsUpdatingRole(true);

    const newRole = roleTarget.role === "USER" ? "ADMIN" : "USER";

    try {
      const response = await fetch(`/api/admin/users/${roleTarget.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error ?? "Failed to update role.");
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === roleTarget.id ? { ...u, role: newRole } : u)),
      );

      toast.success(
        newRole === "ADMIN"
          ? `${roleTarget.name} promoted to Admin.`
          : `${roleTarget.name} demoted to User.`,
      );
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdatingRole(false);
      setRoleTarget(null);
    }
  }

  async function handleStorageUpdate() {
    if (!storageTarget) return;
    setIsUpdatingStorage(true);

    try {
      const response = await fetch(
        `/api/admin/users/${storageTarget.id}/storage`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storageLimitMB: parseInt(storageLimitMB) }),
        },
      );

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error ?? "Failed to update storage.");
        return;
      }

      const newLimitBytes = parseInt(storageLimitMB) * 1024 * 1024;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === storageTarget.id ? { ...u, storageLimit: newLimitBytes } : u,
        ),
      );

      toast.success(`Storage limit updated to ${storageLimitMB}MB.`);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdatingStorage(false);
      setStorageTarget(null);
      setStorageLimitMB("");
    }
  }

  async function handlePlanUpdate() {
    if (!planTarget) return;
    setIsUpdatingPlan(true);

    try {
      const response = await fetch(`/api/admin/users/${planTarget.id}/plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          durationMonths: parseInt(durationMonths),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error ?? "Failed to update plan.");
        return;
      }

      const PLAN_LIMITS: Record<string, number> = {
        FREE: 20971520,
        PREMIUM: 1073741824,
        MAX: 5368709120,
      };

      setUsers((prev) =>
        prev.map((u) =>
          u.id === planTarget.id
            ? {
                ...u,
                plan: selectedPlan,
                storageLimit: PLAN_LIMITS[selectedPlan],
              }
            : u,
        ),
      );

      toast.success(`Plan updated to ${selectedPlan} successfully.`);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdatingPlan(false);
      setPlanTarget(null);
    }
  }
  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-bold text-slate-900 text-2xl">Role Management</h2>
        <p className="mt-1 text-slate-500">
          Manage user roles and storage limits
        </p>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="bg-white py-12 border rounded-lg text-center">
          <p className="text-slate-500 text-sm">No users found.</p>
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
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 text-sm">
                      {user.name ?? "Unnamed User"}
                    </p>
                    <Badge
                      variant="secondary"
                      className={
                        user.role === "ADMIN" ? "bg-blue-100 text-blue-700" : ""
                      }
                    >
                      {user.role}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-xs",
                        user.plan === "MAX"
                          ? "bg-purple-100 text-purple-700"
                          : user.plan === "PREMIUM"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700",
                      )}
                    >
                      {user.plan}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setPlanTarget(user)}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Plan
                    </Button>
                  </div>
                  <p className="text-slate-500 text-xs">{user.email}</p>
                  <p className="mt-0.5 text-slate-400 text-xs">
                    Storage: {formatBytes(user.storageUsed)} /{" "}
                    {formatBytes(user.storageLimit)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    setStorageTarget(user);
                    setStorageLimitMB(
                      String(Math.round(user.storageLimit / (1024 * 1024))),
                    );
                  }}
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  Storage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setRoleTarget(user)}
                >
                  {user.role === "USER" ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      Make Admin
                    </>
                  ) : (
                    <>
                      <ShieldMinus className="w-3.5 h-3.5 text-red-500" />
                      Remove Admin
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Change Dialog */}
      <Dialog open={!!roleTarget} onOpenChange={() => setRoleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {roleTarget?.role === "USER"
                ? "Promote to Admin"
                : "Demote to User"}
            </DialogTitle>
            <DialogDescription>
              {roleTarget?.role === "USER"
                ? `Promote ${roleTarget?.name} to Admin? They will be able to manage print queues.`
                : `Demote ${roleTarget?.name} to User? They will lose admin access.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleTarget(null)}
              disabled={isUpdatingRole}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRoleChange}
              disabled={isUpdatingRole}
              variant={roleTarget?.role === "ADMIN" ? "destructive" : "default"}
            >
              {isUpdatingRole
                ? "Updating..."
                : roleTarget?.role === "USER"
                  ? "Promote to Admin"
                  : "Demote to User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Storage Limit Dialog */}
      <Dialog
        open={!!storageTarget}
        onOpenChange={() => {
          setStorageTarget(null);
          setStorageLimitMB("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Storage Limit</DialogTitle>
            <DialogDescription>
              Update storage limit for{" "}
              <span className="font-medium text-slate-900">
                {storageTarget?.name}
              </span>
              . Current limit:{" "}
              {storageTarget && formatBytes(storageTarget.storageLimit)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <label className="font-medium text-slate-700 text-sm">
              New limit (MB)
            </label>
            <Input
              type="number"
              min="50"
              value={storageLimitMB}
              onChange={(e) => setStorageLimitMB(e.target.value)}
              className="mt-1.5"
              placeholder="e.g. 500"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStorageTarget(null);
                setStorageLimitMB("");
              }}
              disabled={isUpdatingStorage}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStorageUpdate}
              disabled={isUpdatingStorage || !storageLimitMB}
            >
              {isUpdatingStorage ? "Updating..." : "Update Storage"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Update Dialog */}
      <Dialog open={!!planTarget} onOpenChange={() => setPlanTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Plan</DialogTitle>
            <DialogDescription>
              Update plan for{" "}
              <span className="font-medium text-slate-900">
                {planTarget?.name}
              </span>
              . Current plan:{" "}
              <span className="font-medium text-slate-900">
                {planTarget?.plan}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="font-medium text-slate-700 text-sm">
                Select Plan
              </label>
              <div className="gap-2 grid grid-cols-3 mt-2">
                {["FREE", "PREMIUM", "MAX"].map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={cn(
                      "p-3 border rounded-lg font-medium text-sm transition-colors",
                      selectedPlan === plan
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 hover:border-slate-300",
                    )}
                  >
                    <div>{plan}</div>
                    <div className="opacity-70 mt-1 font-normal text-xs">
                      {plan === "FREE" && "20MB"}
                      {plan === "PREMIUM" && "1GB • ₦2,500/mo"}
                      {plan === "MAX" && "5GB • ₦8,000/mo"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedPlan !== "FREE" && (
              <div>
                <label className="font-medium text-slate-700 text-sm">
                  Duration (months)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPlanTarget(null)}
              disabled={isUpdatingPlan}
            >
              Cancel
            </Button>
            <Button onClick={handlePlanUpdate} disabled={isUpdatingPlan}>
              {isUpdatingPlan ? "Updating..." : "Update Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
