import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const role = (session.user as { role: string }).role;

  if (role === "SUPERADMIN") {
    redirect("/user/private-folder");
  }

  if (role === "ADMIN") {
    redirect("/user/private-folder");
  }

  redirect("/user/private-folder");
}
