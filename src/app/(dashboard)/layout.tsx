import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

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
      <Sidebar role={role} />
      <div className="flex flex-col flex-1">
        <Navbar userName={name} userEmail={email} role={role} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
