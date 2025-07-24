"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/lib/components/ui/button";

export function ProductReview({ productId, username = "Anonymous" }: { productId: number; username?: string }) {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, username, rating }),
      });
      if (res.ok) {
        toast.success("Thank you for your review!");
        setRating(0);
      } else {
        toast.error("Failed to submit review.");
      }
    } catch {
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={star <= rating ? "text-yellow-500 text-2xl" : "text-gray-400 text-2xl"}
            onClick={() => setRating(star)}
            disabled={submitting}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      <Button onClick={submitReview} disabled={rating === 0 || submitting}>
        Submit Review
      </Button>
    </div>
  );
} 