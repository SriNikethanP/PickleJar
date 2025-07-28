"use client";

import React from "react";
import { Star } from "lucide-react";

interface ProductRatingProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function ProductRating({
  rating,
  totalReviews = 0,
  size = "md",
  showCount = true,
  className = "",
}: ProductRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const renderStars = () => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${
              star <= Math.round(rating)
                ? "text-yellow-500 fill-current"
                : "text-gray-300"
            } ${sizeClasses[size]} transition-colors`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {renderStars()}
      <div className="flex items-center gap-1">
        <span className={`font-medium ${textSizes[size]}`}>
          {rating.toFixed(1)}
        </span>
        {showCount && totalReviews > 0 && (
          <span className={`text-gray-500 ${textSizes[size]}`}>
            ({totalReviews})
          </span>
        )}
      </div>
    </div>
  );
}
