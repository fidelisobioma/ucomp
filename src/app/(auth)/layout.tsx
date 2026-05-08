import AuthNavbar from "@/components/auth/auth-navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <AuthNavbar />
      <div className="flex flex-1 justify-center items-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
