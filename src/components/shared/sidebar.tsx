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
} from "lucide-react";

type Role = "USER" | "ADMIN" | "SUPERADMIN";

interface SidebarProps {
  role: Role;
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

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = navItemsByRole[role];

  return (
    <aside className="hidden md:flex flex-col bg-white px-4 py-6 border-r w-64 min-h-screen">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="font-bold text-slate-900 text-xl tracking-tight">
          Ucomp
        </h1>
        <p className="mt-0.5 text-slate-500 text-xs">Cybercafé Portal</p>
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
    </aside>
  );
}
