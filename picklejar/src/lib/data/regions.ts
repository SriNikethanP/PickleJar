import { apiClient } from "@lib/api";

export const getRegions = async (): Promise<any[]> => {
  try {
    const result = await apiClient.get("/regions");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

export const getRegion = async (regionId: string): Promise<any> => {
  try {
    const result = await apiClient.get(`/regions/${regionId}`);
    return result || null;
  } catch (error) {
    console.error("Error fetching region:", error);
    return null;
  }
};

export const getRegionCurrencies = async (): Promise<any[]> => {
  try {
    const result = await apiClient.get("/regions/currencies");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching region currencies:", error);
    return [];
  }
};

export const getRegionPaymentProviders = async (regionId: string): Promise<any[]> => {
  try {
    const result = await apiClient.get(`/regions/${regionId}/payment-providers`);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching region payment providers:", error);
    return [];
  }
};

export const getRegionFulfillmentProviders = async (regionId: string): Promise<any[]> => {
  try {
    const result = await apiClient.get(`/regions/${regionId}/fulfillment-providers`);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching region fulfillment providers:", error);
    return [];
  }
};
