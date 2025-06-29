import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncateText(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
