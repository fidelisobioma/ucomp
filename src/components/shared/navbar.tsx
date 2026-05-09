"use client";

import { signOut } from "next-auth/react";
import { LogOut, User, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  onMobileMenuOpen: () => void;
}

export default function Navbar({
  userName,
  userEmail,
  onMobileMenuOpen,
}: NavbarProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex justify-between items-center bg-white px-6 border-b h-16">
      {/* Left — Mobile hamburger + Logo */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileMenuOpen}
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </Button>
        <span className="md:hidden font-bold text-slate-900">Ucomp</span>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3 ml-auto">
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="px-2">
              <Avatar className="w-8 h-8">
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
            <DropdownMenuItem className="gap-2">
              <User className="w-4 h-4" />
              Profile
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
