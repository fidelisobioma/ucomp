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
  PenLine,
  FolderOpen,
  QrCode,
  X,
} from "lucide-react";

type Role = "USER" | "ADMIN" | "SUPERADMIN";

interface SidebarProps {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

// const adminNavItems: NavItem[] = [
//   { label: "My Documents", href: "/user/private-folder", icon: FolderLock },
//   { label: "My Print Queue", href: "/user/print-queue", icon: PrinterIcon },
//   { label: "Users", href: "/admin/users", icon: Users },
//   { label: "Blog Posts", href: "/admin/blog", icon: PenLine },
//   {
//     label: "Blog Categories",
//     href: "/admin/blog/categories",
//     icon: FolderOpen,
//   },
// ];

// const superAdminNavItems: NavItem[] = [
//   { label: "My Documents", href: "/user/private-folder", icon: FolderLock },
//   { label: "My Print Queue", href: "/user/print-queue", icon: PrinterIcon },
//   { label: "Users", href: "/admin/users", icon: Users },
//   { label: "Blog Posts", href: "/admin/blog", icon: PenLine },
//   {
//     label: "Blog Categories",
//     href: "/admin/blog/categories",
//     icon: FolderOpen,
//   },
//   { label: "Role Management", href: "/super-admin/roles", icon: ShieldCheck },
//   { label: "Settings", href: "/super-admin/settings", icon: Settings },
// ];

const adminNavItems: NavItem[] = [
  { label: "My Documents", href: "/user/private-folder", icon: FolderLock },
  { label: "My Print Queue", href: "/user/print-queue", icon: PrinterIcon },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Blog Posts", href: "/admin/blog", icon: PenLine },
  {
    label: "Blog Categories",
    href: "/admin/blog/categories",
    icon: FolderOpen,
  },
  { label: "QR Code", href: "/admin/qr-code", icon: QrCode },
];

const superAdminNavItems: NavItem[] = [
  { label: "My Documents", href: "/user/private-folder", icon: FolderLock },
  { label: "My Print Queue", href: "/user/print-queue", icon: PrinterIcon },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Blog Posts", href: "/admin/blog", icon: PenLine },
  {
    label: "Blog Categories",
    href: "/admin/blog/categories",
    icon: FolderOpen,
  },
  { label: "QR Code", href: "/admin/qr-code", icon: QrCode },
  { label: "Role Management", href: "/super-admin/roles", icon: ShieldCheck },
  { label: "Settings", href: "/super-admin/settings", icon: Settings },
];

const navItemsByRole: Record<Role, NavItem[]> = {
  USER: userNavItems,
  ADMIN: adminNavItems,
  SUPERADMIN: superAdminNavItems,
};

function NavItems({ role, onClose }: { role: Role; onClose?: () => void }) {
  const pathname = usePathname();
  const navItems = navItemsByRole[role];

  return (
    <>
      <Link href="/" className="block mb-8 px-2" onClick={onClose}>
        <h1 className="font-bold text-slate-900 text-xl tracking-tight">
          Ucomp
        </h1>
        <p className="mt-0.5 text-slate-500 text-xs">Cybercafé Portal</p>
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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
}

export default function Sidebar({ role, open, onOpenChange }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-white px-4 py-6 border-r w-64 min-h-screen">
        <NavItems role={role} />
      </aside>

      {/* Mobile Backdrop */}
      {open && (
        <div
          className="md:hidden z-40 fixed inset-0 bg-black/50"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Mobile Sidebar Panel */}
      <div
        className={cn(
          "md:hidden top-0 left-0 z-50 fixed bg-white shadow-xl px-4 py-6 w-64 h-full transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Close Button */}
        <button
          className="top-4 right-4 absolute text-slate-500 hover:text-slate-900"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <NavItems role={role} onClose={() => onOpenChange(false)} />
      </div>
    </>
  );
}
