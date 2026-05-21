import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "₦0",
    description: "Perfect for occasional printing and document storage.",
    storage: "20MB",
    features: [
      "20MB private storage",
      "PDF, DOCX, JPG, PNG support",
      "Print queue access",
      "In-app notifications",
      "Documents never deleted",
      "Basic support",
    ],
    cta: "Get Started",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "₦2,500/mo",
    description: "For regular users who need more storage.",
    storage: "1GB",
    features: [
      "1GB private storage",
      "PDF, DOCX, JPG, PNG support",
      "Print queue access",
      "In-app notifications",
      "Documents never deleted",
      "Priority support",
    ],
    cta: "Contact Us",
    href: "mailto:hello@ucomp.com",
    highlighted: true,
  },
  {
    name: "Max",
    price: "₦8,000/mo",
    description: "For power users with large storage needs.",
    storage: "5GB",
    features: [
      "5GB private storage",
      "PDF, DOCX, JPG, PNG support",
      "Print queue access",
      "In-app notifications",
      "Documents never deleted",
      "24/7 support",
    ],
    cta: "Contact Us",
    href: "mailto:hello@ucomp.com",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-bold text-slate-900 text-3xl md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Start for free. Upgrade when you need more storage. No hidden fees,
            no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-5xl">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col p-8 border rounded-2xl",
                plan.highlighted
                  ? "bg-slate-900 border-slate-900 shadow-xl scale-105"
                  : "bg-white",
              )}
            >
              <div className="mb-6">
                <h3
                  className={cn(
                    "mb-1 font-semibold text-lg",
                    plan.highlighted ? "text-white" : "text-slate-900",
                  )}
                >
                  {plan.name}
                </h3>
                <div
                  className={cn(
                    "mb-2 font-bold text-3xl",
                    plan.highlighted ? "text-white" : "text-slate-900",
                  )}
                >
                  {plan.price}
                </div>
                <p
                  className={cn(
                    "text-sm",
                    plan.highlighted ? "text-slate-400" : "text-slate-500",
                  )}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "w-4 h-4 shrink-0",
                        plan.highlighted ? "text-white" : "text-slate-900",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        plan.highlighted ? "text-slate-300" : "text-slate-600",
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.highlighted ? "secondary" : "outline"}
                className={cn(
                  "w-full",
                  !plan.highlighted &&
                    "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white",
                )}
                disabled={plan.cta === "Coming Soon"}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
