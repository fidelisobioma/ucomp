"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FolderLock,
  PrinterIcon,
  Users,
  ShieldCheck,
  Settings,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
  { label: "My Documents", href: "/user/private-folder", icon: FolderLock },
  { label: "My Print Queue", href: "/user/print-queue", icon: PrinterIcon },
  { label: "Users", href: "/admin/users", icon: Users },
];

const superAdminNavItems: NavItem[] = [
  { label: "My Documents", href: "/user/private-folder", icon: FolderLock },
  { label: "My Print Queue", href: "/user/print-queue", icon: PrinterIcon },
  { label: "Users", href: "/admin/users", icon: Users },
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
      {/* Logo */}
      <Link href="/" className="block mb-8 px-2" onClick={onClose}>
        <h1 className="font-bold text-slate-900 text-xl tracking-tight">
          Ucomp
        </h1>
        <p className="mt-0.5 text-slate-500 text-xs">Cybercafé Portal</p>
      </Link>

      {/* Nav Items */}
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

export default function Sidebar({ role }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-white px-4 py-6 border-r w-64 min-h-screen">
        <NavItems role={role} />
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden bottom-6 left-6 z-50 fixed">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="bg-slate-900 hover:bg-slate-700 shadow-lg rounded-full"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="px-4 py-6 w-64">
            <NavItems role={role} onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
