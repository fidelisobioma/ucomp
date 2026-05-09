"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FolderLock,
  PrinterIcon,
  Users,
  ShieldCheck,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Role = "USER" | "ADMIN" | "SUPERADMIN";

interface SidebarProps {
  role: Role;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const userNavItems: NavItem[] = [
  { label: "Private Folder", href: "/user/private-folder", icon: FolderLock },
  { label: "Print Queue", href: "/user/print-queue", icon: PrinterIcon },
];

const adminNavItems: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Print Queue", href: "/admin/print-queue", icon: PrinterIcon },
];

const superAdminNavItems: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Print Queue", href: "/admin/print-queue", icon: PrinterIcon },
  { label: "Role Management", href: "/super-admin/roles", icon: ShieldCheck },
  { label: "Settings", href: "/super-admin/settings", icon: Settings },
];

const navItemsByRole: Record<Role, NavItem[]> = {
  USER: userNavItems,
  ADMIN: adminNavItems,
  SUPERADMIN: superAdminNavItems,
};

export default function Sidebar({
  role,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const navItems = navItemsByRole[role];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex justify-between items-center mb-8 px-2">
        <Link href="/" className="group">
          <h1 className="font-bold text-slate-900 group-hover:text-slate-600 text-xl tracking-tight transition-colors">
            Ucomp
          </h1>
          <p className="mt-0.5 text-slate-500 text-xs">Cybercafé Portal</p>
        </Link>
        {/* Close button — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-white px-4 py-6 border-r w-64 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden z-50 fixed inset-0 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40" onClick={onMobileClose} />
          {/* Sidebar Panel */}
          <aside className="relative flex flex-col bg-white shadow-xl px-4 py-6 w-64 min-h-screen">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
