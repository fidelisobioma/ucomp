import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/shared/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { name, email, role, image } = session.user as {
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPERADMIN";
    image?: string | null;
  };

  return (
    <DashboardShell name={name} email={email} role={role} userImage={image}>
      {children}
    </DashboardShell>
  );
}
