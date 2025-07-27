"use client";

import { useState } from "react";
import { Product } from "@lib/data/products";

type ProductTabsProps = {
  product: Product;
};

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "description"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Reviews
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "description" && (
          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">
                      {review.username || "Anonymous"}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{review.rating}/5</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">Rating: {review.rating}/5</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
