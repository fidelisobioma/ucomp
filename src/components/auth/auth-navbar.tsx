import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthNavbar() {
  return (
    <header className="flex items-center bg-white px-6 border-b h-16">
      <Link
        href="/"
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-bold text-slate-900 text-lg">Ucomp</span>
      </Link>
    </header>
  );
}
