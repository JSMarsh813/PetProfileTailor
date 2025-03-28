import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
//twMerge: Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
