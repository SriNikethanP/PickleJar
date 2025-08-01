"use server";

// Mock payment methods since backend doesn't have payment method endpoints yet
const mockPaymentMethods = [
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Pay with credit/debit card or UPI",
    icon: "credit-card",
    enabled: true,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: "cash",
    enabled: true,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    description: "Direct bank transfer",
    icon: "bank",
    enabled: true,
  },
];

export const getPaymentMethods = async (): Promise<any[]> => {
  try {
    // TODO: Implement payment methods endpoint in backend
    // For now, return mock data
    console.warn(
      "Payment methods endpoint not implemented in backend yet, using mock data"
    );
    return mockPaymentMethods;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }
};

export const createPaymentIntent = async (paymentData: any): Promise<any> => {
  try {
    // TODO: Implement create payment intent endpoint in backend
    console.warn(
      "Create payment intent endpoint not implemented in backend yet"
    );
    return {
      id: "mock-payment-intent-id",
      status: "pending",
      ...paymentData,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export const confirmPayment = async (
  paymentId: string,
  paymentData: any
): Promise<any> => {
  try {
    // TODO: Implement confirm payment endpoint in backend
    console.warn(
      `Confirm payment endpoint not implemented in backend yet for ${paymentId}`
    );
    return {
      id: paymentId,
      status: "succeeded",
      ...paymentData,
    };
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};
