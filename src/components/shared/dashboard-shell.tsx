"use client";

import { useState } from "react";
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";

type Role = "USER" | "ADMIN" | "SUPERADMIN";

interface DashboardShellProps {
  children: React.ReactNode;
  name: string;
  email: string;
  role: Role;
  userImage?: string | null;
}

export default function DashboardShell({
  children,
  name,
  email,
  role,
  userImage,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role={role} open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="flex flex-col flex-1">
        <Navbar
          userName={name}
          userEmail={email}
          role={role}
          userImage={userImage}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
