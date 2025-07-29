"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@lib/context/auth-context";
import {
  getProductReviewData,
  addProductReview,
  Review,
  ReviewResponse,
} from "@lib/api/reviews";
import { Button } from "@lib/components/ui/button";
import { Input } from "@lib/components/ui/input";
import { toast } from "sonner";
import { Star, MessageCircle, ThumbsUp, User, Calendar } from "lucide-react";
import { Textarea } from "@lib/components/ui/textarea";

interface ProductReviewSystemProps {
  productId: number;
  productName: string;
}

export function ProductReviewSystem({
  productId,
  productName,
}: ProductReviewSystemProps) {
  const { user } = useAuth();
  const [reviewData, setReviewData] = useState<ReviewResponse>({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchReviewData();
  }, [productId]);

  useEffect(() => {
    if (user) {
      setUsername(user.fullName || user.email || "Anonymous");
    }
  }, [user]);

  const fetchReviewData = async () => {
    setLoading(true);
    try {
      const data = await getProductReviewData(productId);
      setReviewData(data);
    } catch (error) {
      console.error("Error fetching review data:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please add a comment");
      return;
    }

    if (comment.length > 1000) {
      toast.error("Comment must be less than 1000 characters");
      return;
    }

    setSubmitting(true);
    try {
      await addProductReview(productId, {
        username: username || "Anonymous",
        rating,
        comment: comment.trim(),
      });

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      setShowReviewForm(false);

      // Refresh review data
      await fetchReviewData();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    size = "text-lg"
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            className={`${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            } ${size} transition-colors ${
              interactive ? "hover:text-yellow-400 cursor-pointer" : ""
            }`}
            onClick={() => interactive && setRating(star)}
            disabled={!interactive || submitting}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Review Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Customer Reviews
          </h3>
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="outline"
            size="sm"
          >
            Write a Review
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {reviewData.averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(reviewData.averageRating))}
            <div className="text-sm text-gray-600 mt-1">
              {reviewData.totalReviews} review
              {reviewData.totalReviews !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm text-gray-600">
              Based on {reviewData.totalReviews} customer review
              {reviewData.totalReviews !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">
            Write a Review for {productName}
          </h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              {renderStars(rating, true, "text-2xl")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name (optional)"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Comment *
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                maxLength={1000}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {comment.length}/1000 characters
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting || rating === 0 || !comment.trim()}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(0);
                  setComment("");
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviewData.reviews.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Customer Reviews</h4>
          {reviewData.reviews.map((review) => (
            <div key={review.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{review.username}</span>
                  {review.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(review.createdAt)}
                </div>
              </div>

              <div className="mb-3">{renderStars(review.rating)}</div>

              {review.comment && (
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}
