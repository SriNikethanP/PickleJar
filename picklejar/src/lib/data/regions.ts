"use server";

import { sdk } from "@lib/config";
import medusaError from "@lib/util/medusa-error";
import { HttpTypes } from "@medusajs/types";
import { getCacheOptions } from "./cookies";

export const listRegions = async () => {
  try {
    const next = {
      ...(await getCacheOptions("regions")),
    };

    return sdk.client
      .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .then(({ regions }) => regions)
      .catch((error) => {
        console.error("Error fetching regions:", error);
        return [];
      });
  } catch (error) {
    console.error("Error in listRegions:", error);
    return [];
  }
};

export const retrieveRegion = async (id: string) => {
  try {
    const next = {
      ...(await getCacheOptions(["regions", id].join("-"))),
    };

    return sdk.client
      .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .then(({ region }) => region)
      .catch((error) => {
        console.error("Error fetching region:", error);
        return null;
      });
  } catch (error) {
    console.error("Error in retrieveRegion:", error);
    return null;
  }
};

export const getRegion = async (countryCode: string) => {
  try {
    // For India-only setup, we'll get the first region that includes India
    const regions = await listRegions();

    if (!regions || regions.length === 0) {
      return null;
    }

    // Find the region that includes India
    const indiaRegion = regions.find((region) =>
      region.countries?.some((country) => country.iso_2 === "in")
    );

    return indiaRegion || null;
  } catch (e: any) {
    console.error("Error in getRegion:", e);
    return null;
  }
};
