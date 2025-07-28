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
    return await apiClient.get(`/products/${productId}/reviews`);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// Get average rating for a product
export const getProductRating = async (productId: number): Promise<number> => {
  try {
    return await apiClient.get(`/products/${productId}/rating`);
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
    return await apiClient.post(`/products/${productId}/reviews`, review);
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
