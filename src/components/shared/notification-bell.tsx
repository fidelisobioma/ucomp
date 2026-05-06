"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, Printer, Clock, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

function NotificationIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4 shrink-0";
  if (type === "PRINT")
    return <Printer className={cn(iconClass, "text-green-500")} />;
  if (type === "EXPIRY")
    return <Clock className={cn(iconClass, "text-amber-500")} />;
  if (type === "DELETE")
    return <Trash2 className={cn(iconClass, "text-red-500")} />;
  if (type === "ROLE_CHANGE")
    return <ShieldCheck className={cn(iconClass, "text-blue-500")} />;
  return <Bell className={cn(iconClass, "text-slate-500")} />;
}

function formatTime(date: string): string {
  const now = new Date();
  const created = new Date(date);
  const diff = now.getTime() - created.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) return;
      const data = await response.json();
      setNotifications(data.notifications);
    } catch {
      // Silent fail for polling
    }
  }, []);

  async function markAllAsRead() {
    try {
      await fetch("/api/notifications/mark-read", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Silent fail
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark as read when dropdown opens
  useEffect(() => {
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
  }, [open, unreadCount]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="top-1.5 right-1.5 absolute bg-red-500 rounded-full w-2 h-2" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="font-normal text-slate-500 text-xs">
              {unreadCount} unread
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="py-6 text-center">
            <Bell className="mx-auto mb-2 w-8 h-8 text-slate-300" />
            <p className="text-slate-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 last:border-0 border-b",
                  !notification.read && "bg-slate-50",
                )}
              >
                <div className="mt-0.5">
                  <NotificationIcon type={notification.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-slate-400 text-xs">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="bg-blue-500 mt-1.5 rounded-full w-1.5 h-1.5 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
