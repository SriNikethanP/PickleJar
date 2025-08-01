"use server";

// Mock fulfillment data since backend doesn't have fulfillment endpoints yet
const mockFulfillmentOptions = [
  {
    id: "manual",
    name: "Manual Fulfillment",
    description: "Manual order processing and shipping",
    price: 0,
    currency_code: "inr",
  },
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Standard shipping with tracking",
    price: 100,
    currency_code: "inr",
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "Fast delivery with priority handling",
    price: 200,
    currency_code: "inr",
  },
];

export const getFulfillmentOptions = async (): Promise<any[]> => {
  try {
    // TODO: Implement fulfillment options endpoint in backend
    // For now, return mock data
    console.warn(
      "Fulfillment options endpoint not implemented in backend yet, using mock data"
    );
    return mockFulfillmentOptions;
  } catch (error) {
    console.error("Error fetching fulfillment options:", error);
    return [];
  }
};

export const createFulfillment = async (fulfillmentData: any): Promise<any> => {
  try {
    // TODO: Implement create fulfillment endpoint in backend
    console.warn("Create fulfillment endpoint not implemented in backend yet");
    return {
      id: "mock-fulfillment-id",
      status: "pending",
      ...fulfillmentData,
    };
  } catch (error) {
    console.error("Error creating fulfillment:", error);
    throw error;
  }
};

export const getFulfillment = async (fulfillmentId: string): Promise<any> => {
  try {
    // TODO: Implement get fulfillment endpoint in backend
    console.warn(
      `Get fulfillment endpoint not implemented in backend yet for ${fulfillmentId}`
    );
    return {
      id: fulfillmentId,
      status: "pending",
      tracking_number: "MOCK-TRACKING-123",
    };
  } catch (error) {
    console.error("Error fetching fulfillment:", error);
    return null;
  }
};

export const cancelFulfillment = async (
  fulfillmentId: string
): Promise<any> => {
  try {
    // TODO: Implement cancel fulfillment endpoint in backend
    console.warn(
      `Cancel fulfillment endpoint not implemented in backend yet for ${fulfillmentId}`
    );
    return {
      id: fulfillmentId,
      status: "cancelled",
    };
  } catch (error) {
    console.error("Error canceling fulfillment:", error);
    throw error;
  }
};
