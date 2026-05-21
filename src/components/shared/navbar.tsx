import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Settings, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationBell from "@/components/shared/notification-bell";

interface NavbarProps {
  userName: string;
  userEmail: string;
  role: string;
  userImage?: string | null;
  onMenuClick: () => void;
}

export default function Navbar({
  userName,
  userEmail,
  role,
  userImage,
  onMenuClick,
}: NavbarProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex justify-between items-center bg-white px-6 border-b h-16">
      {/* Left — Mobile Menu Button + Logo */}
      <div className="md:hidden flex items-center gap-3">
        <button
          className="text-slate-600 hover:text-slate-900"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="font-bold text-slate-900 text-lg">
          Ucomp
        </Link>
      </div>

      {/* Desktop — empty left side */}
      <div className="hidden md:block" />

      {/* Right — Actions */}
      <div className="flex items-center gap-3">
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="data-[state=open]:bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent px-2"
            >
              <Avatar className="w-8 h-8">
                {userImage && <AvatarImage src={userImage} alt={userName} />}
                <AvatarFallback className="bg-slate-100 font-medium text-slate-700 text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{userName}</span>
                <span className="font-normal text-slate-500 text-xs">
                  {userEmail}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2">
              <Link href="/settings">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
