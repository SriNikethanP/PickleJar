import { apiClient } from "@lib/api";

export interface Review {
  id: number;
  username: string;
  rating: number;
  comment?: string;
  createdAt: string;
  verified: boolean;
}

export interface CreateReviewRequest {
  username: string;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

// Get reviews for a product
export const getProductReviews = async (
  productId: number
): Promise<Review[]> => {
  try {
    const result = await apiClient.get(`/products/${productId}/reviews`);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// Get average rating for a product
export const getProductRating = async (productId: number): Promise<number> => {
  try {
    const result = await apiClient.get(`/products/${productId}/rating`);
    return typeof result === "number" ? result : 0;
  } catch (error) {
    console.error("Error fetching rating:", error);
    return 0;
  }
};

// Add a review to a product
export const addProductReview = async (
  productId: number,
  review: CreateReviewRequest
): Promise<Review> => {
  try {
    const result = await apiClient.post(
      `/products/${productId}/reviews`,
      review
    );
    if (
      !result ||
      typeof result !== 'object' ||
      typeof result.id !== 'number' ||
      typeof result.username !== 'string' ||
      typeof result.rating !== 'number' ||
      typeof result.createdAt !== 'string' ||
      typeof result.verified !== 'boolean'
    ) {
      throw new Error("Failed to add review: Invalid response");
    }
    return result;
  } catch (error: any) {
    console.error("Error adding review:", error);
    throw new Error(error.message || "Failed to add review");
  }
};

// Get complete review data for a product
export const getProductReviewData = async (
  productId: number
): Promise<ReviewResponse> => {
  try {
    const [reviews, averageRating] = await Promise.all([
      getProductReviews(productId),
      getProductRating(productId),
    ]);

    return {
      reviews,
      averageRating,
      totalReviews: reviews.length,
    };
  } catch (error) {
    console.error("Error fetching review data:", error);
    return {
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
    };
  }
};
