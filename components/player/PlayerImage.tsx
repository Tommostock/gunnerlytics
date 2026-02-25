"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PlayerImageProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-28 h-28 sm:w-32 sm:h-32",
};

export function PlayerImage({ src, alt, size = "md", className }: PlayerImageProps) {
  const [error, setError] = useState(false);

  const initials = alt
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src || error) {
    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-arsenal-red to-arsenal-dark flex items-center justify-center flex-shrink-0",
          sizeClasses[size],
          className
        )}
      >
        <span
          className={cn(
            "font-bold text-white",
            size === "sm" && "text-xs",
            size === "md" && "text-lg",
            size === "lg" && "text-2xl"
          )}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={cn(
        "rounded-full object-cover flex-shrink-0 bg-surface-200 dark:bg-surface-800",
        sizeClasses[size],
        className
      )}
    />
  );
}
