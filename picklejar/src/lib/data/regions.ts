"use server";

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const listRegions = async () => {
  try {
    const res = await api.get("/regions");
    return res.data.regions;
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

export const retrieveRegion = async (id: string) => {
  try {
    const res = await api.get(`/regions/${id}`);
    return res.data.region;
  } catch (error) {
    console.error("Error fetching region:", error);
    return null;
  }
};

export const getRegion = async (countryCode: string) => {
  try {
    const regions = await listRegions();
    if (!regions || regions.length === 0) {
      return null;
    }
    const indiaRegion = regions.find((region: any) =>
      region.countries?.some((country: any) => country.iso_2 === "in")
    );
    return indiaRegion || null;
  } catch (e: any) {
    console.error("Error in getRegion:", e);
    return null;
  }
};
