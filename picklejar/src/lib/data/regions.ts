// Mock region data since backend doesn't have regions endpoints yet
const mockRegions = {
  in: {
    id: "in",
    name: "India",
    currency_code: "inr",
    currency_symbol: "₹",
    tax_rate: 0.18,
    tax_code: "GST",
    tax_rates: [
      {
        rate: 0.18,
        code: "GST",
        name: "Goods and Services Tax",
      },
    ],
    payment_providers: [
      {
        id: "razorpay",
        name: "Razorpay",
        data: {},
      },
      {
        id: "cod",
        name: "Cash on Delivery",
        data: {},
      },
    ],
    fulfillment_providers: [
      {
        id: "manual",
        name: "Manual Fulfillment",
        data: {},
      },
    ],
  },
};

export const getRegions = async (): Promise<any[]> => {
  try {
    // TODO: Implement regions endpoint in backend
    // For now, return mock data
    console.warn(
      "Regions endpoint not implemented in backend yet, using mock data"
    );
    return Object.values(mockRegions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

export const getRegion = async (regionId: string): Promise<any> => {
  try {
    // TODO: Implement region endpoint in backend
    // For now, return mock data
    console.warn(
      `Region endpoint not implemented in backend yet, using mock data for ${regionId}`
    );
    return mockRegions[regionId as keyof typeof mockRegions] || null;
  } catch (error) {
    console.error("Error fetching region:", error);
    return null;
  }
};

export const getRegionCurrencies = async (): Promise<any[]> => {
  try {
    // TODO: Implement region currencies endpoint in backend
    // For now, return mock data
    console.warn(
      "Region currencies endpoint not implemented in backend yet, using mock data"
    );
    return [{ code: "inr", symbol: "₹", name: "Indian Rupee" }];
  } catch (error) {
    console.error("Error fetching region currencies:", error);
    return [];
  }
};

export const getRegionPaymentProviders = async (
  regionId: string
): Promise<any[]> => {
  try {
    // TODO: Implement region payment providers endpoint in backend
    // For now, return mock data
    console.warn(
      `Region payment providers endpoint not implemented in backend yet, using mock data for ${regionId}`
    );
    const region = mockRegions[regionId as keyof typeof mockRegions];
    return region?.payment_providers || [];
  } catch (error) {
    console.error("Error fetching region payment providers:", error);
    return [];
  }
};

export const getRegionFulfillmentProviders = async (
  regionId: string
): Promise<any[]> => {
  try {
    // TODO: Implement region fulfillment providers endpoint in backend
    // For now, return mock data
    console.warn(
      `Region fulfillment providers endpoint not implemented in backend yet, using mock data for ${regionId}`
    );
    const region = mockRegions[regionId as keyof typeof mockRegions];
    return region?.fulfillment_providers || [];
  } catch (error) {
    console.error("Error fetching region fulfillment providers:", error);
    return [];
  }
};
