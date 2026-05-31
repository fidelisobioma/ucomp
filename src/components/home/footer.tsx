import Link from "next/link";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "Features", href: "#features" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const socialLinks = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaXTwitter, href: "#", label: "Twitter / X" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto px-6 py-16 max-w-7xl">
        <div className="gap-12 grid grid-cols-1 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-3 font-bold text-xl">Ucomp</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your documents, printed in minutes. Fast, private, and secure
              cybercafé services at your fingertips.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex justify-center items-center bg-slate-800 hover:bg-slate-700 rounded-full w-9 h-9 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-sm">Contact Us</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>hello@ucomp.com</li>
              <li>123 Placeholder Street, Aba, Abia State, Nigeria</li>
              <li> Mon - Sat: 8:00 AM - 8:00 PM</li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-800 my-10" />

        <div className="flex md:flex-row flex-col justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© 2025 Ucomp. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
