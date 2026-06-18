import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateFileName(name: string, maxLength: number = 20): string {
  if (name.length <= maxLength) return name;
  const ext = name.split(".").pop();
  const baseName = name.substring(0, name.lastIndexOf("."));
  const truncated = baseName.substring(0, maxLength - (ext?.length ?? 0) - 4);
  return `${truncated}...${ext}`;
}
