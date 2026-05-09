import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const role = (session.user as { role: string }).role;

  if (role === "SUPERADMIN") {
    redirect("/super-admin/roles");
  }

  if (role === "ADMIN") {
    redirect("/admin/users");
  }

  redirect("/user/private-folder");
}
