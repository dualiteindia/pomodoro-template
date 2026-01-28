import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TreeStage } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Strict percentage-based growth logic
export const getTreeStage = (completed: number, total: number): TreeStage => {
  if (!total || total <= 0) return "SEED"; // Safety check
  
  const percentage = completed / total;

  if (percentage >= 1) return "MATURE";      // 100%
  if (percentage >= 0.75) return "YOUNG";    // 75%
  if (percentage >= 0.50) return "SAPLING";  // 50%
  if (percentage >= 0.25) return "SPROUT";   // 25%
  return "SEED";                             // 0% - < 25%
};
