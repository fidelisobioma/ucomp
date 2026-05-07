"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function HomeNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        isScrolled
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
            isScrolled ? "text-slate-900" : "text-white",
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
                isScrolled
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-white/90 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className={cn(
              "transition-colors",
              !isScrolled &&
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
              isScrolled
                ? "bg-slate-900 text-white hover:bg-slate-700"
                : "bg-white text-slate-900 hover:bg-slate-900 hover:text-white",
            )}
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
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
                isScrolled ? "text-slate-900" : "text-white",
              )}
            />
          ) : (
            <Menu
              className={cn(
                "w-6 h-6",
                isScrolled ? "text-slate-900" : "text-white",
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
            <Button variant="outline" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
