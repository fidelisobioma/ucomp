"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { name, email, role } = session.user as {
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPERADMIN";
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar
        role={role}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <div className="flex flex-col flex-1">
        <Navbar
          userName={name}
          userEmail={email}
          role={role}
          onMobileMenuOpen={() => setIsMobileOpen(true)}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
