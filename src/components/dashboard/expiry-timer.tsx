"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ExpiryTimerProps {
  expiresAt: Date;
}

export default function ExpiryTimer({ expiresAt }: ExpiryTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsUrgent(hours < 1);
      setTimeLeft(
        hours > 0
          ? `${hours}h ${minutes}m ${seconds}s`
          : `${minutes}m ${seconds}s`,
      );
    }

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <span
      className={cn(
        "font-medium text-xs",
        isUrgent ? "text-red-500" : "text-slate-500",
      )}
    >
      Expires in: {timeLeft}
    </span>
  );
}
