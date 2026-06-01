"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeNavbarProps {
  solid?: boolean;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
];

export default function HomeNavbar({ solid = false }: HomeNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isSolid = solid || isScrolled;
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "top-0 right-0 left-0 z-50 fixed transition-all duration-300",
        isSolid
          ? "bg-white/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="flex justify-between items-center mx-auto px-6 max-w-7xl h-16">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-bold text-xl transition-colors",
            isSolid ? "text-slate-900" : "text-white",
          )}
        >
          Ucomp
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-medium text-sm transition-colors",
                isSolid
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-white/90 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "data-[state=open]:bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent px-2",
                  )}
                >
                  <Avatar className="w-8 h-8">
                    {session?.user?.image && (
                      <AvatarImage src={session.user.image} alt={userName} />
                    )}
                    <AvatarFallback
                      className={cn(
                        "font-medium text-sm",
                        isSolid
                          ? "bg-slate-100 text-slate-700"
                          : "bg-white/20 text-white border border-white/30",
                      )}
                    >
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
                  <Link href="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
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
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                className={cn(
                  "transition-colors",
                  !isSolid &&
                    "border-white/50 text-slate-800 hover:bg-white/20 hover:text-slate-900",
                )}
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className={cn(
                  "transition-colors",
                  isSolid
                    ? "bg-slate-900 text-white hover:bg-slate-700"
                    : "bg-white text-slate-900 hover:bg-slate-900 hover:text-white",
                )}
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X
              className={cn(
                "w-6 h-6",
                isSolid ? "text-slate-900" : "text-white",
              )}
            />
          ) : (
            <Menu
              className={cn(
                "w-6 h-6",
                isSolid ? "text-slate-900" : "text-white",
              )}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden space-y-4 bg-white px-6 py-4 border-t">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block font-medium text-slate-600 hover:text-slate-900 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t">
            {isLoggedIn ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
