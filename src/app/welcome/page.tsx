import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrinterIcon, Upload, Clock, Shield } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex flex-col justify-center items-center bg-slate-900 px-6 py-12 min-h-screen">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="font-bold text-white text-4xl">Ucomp</h1>
        <p className="mt-2 text-slate-400 text-sm">Your cybercafé, smarter</p>
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-2xl p-8 rounded-3xl w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center bg-slate-900 mx-auto mb-4 rounded-2xl w-16 h-16">
            <PrinterIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-bold text-slate-900 text-2xl">Welcome! 👋</h2>
          <p className="mt-2 text-slate-500 text-sm">
            Print your documents quickly and securely from your phone.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex justify-center items-center bg-slate-900 rounded-full w-7 h-7 font-bold text-white text-xs shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">
                Create a free account
              </p>
              <p className="text-slate-500 text-xs">
                Sign up with your email or Google
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex justify-center items-center bg-slate-900 rounded-full w-7 h-7 font-bold text-white text-xs shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">
                Upload your document
              </p>
              <p className="text-slate-500 text-xs">
                PDF, Word, JPG or PNG — up to 20MB free
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex justify-center items-center bg-slate-900 rounded-full w-7 h-7 font-bold text-white text-xs shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">
                Queue for printing
              </p>
              <p className="text-slate-500 text-xs">
                Send to our admin and it will be printed for you
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Button className="w-full" size="lg" asChild>
            <Link href="/sign-up">Get Started. It is Free</Link>
          </Button>
          <Button variant="outline" className="w-full" size="lg" asChild>
            <Link href="/sign-in">I Already Have an Account</Link>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="gap-6 grid grid-cols-3 mt-10 w-full max-w-sm">
        <div className="text-center">
          <Upload className="mx-auto mb-1.5 w-5 h-5 text-slate-400" />
          <p className="text-slate-400 text-xs">Upload from phone</p>
        </div>
        <div className="text-center">
          <Clock className="mx-auto mb-1.5 w-5 h-5 text-slate-400" />
          <p className="text-slate-400 text-xs">Ready in minutes</p>
        </div>
        <div className="text-center">
          <Shield className="mx-auto mb-1.5 w-5 h-5 text-slate-400" />
          <p className="text-slate-400 text-xs">Private & secure</p>
        </div>
      </div>

      <p className="mt-8 text-slate-600 text-xs">
        © {new Date().getFullYear()} Ucomp. All rights reserved.
      </p>
    </div>
  );
}
