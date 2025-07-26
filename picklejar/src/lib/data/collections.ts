"use server";

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export type Collection = {
  id: string;
  title: string;
  handle: string;
  products: any[];
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const listCollections = async (): Promise<Collection[]> => {
  try {
    const res = await api.get("/collections");
    return Array.isArray(res.data)
      ? res.data.map((collection: any) => ({
          id: collection.id.toString(),
          title: collection.title,
          handle: collection.handle,
          products: collection.products || [],
          metadata: collection.metadata || null,
          created_at: collection.created_at || new Date().toISOString(),
          updated_at: collection.updated_at || new Date().toISOString(),
          deleted_at: collection.deleted_at || null,
        }))
      : [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};

export const getCollectionByHandle = async (
  handle: string
): Promise<Collection | null> => {
  try {
    const res = await api.get("/collections", { params: { handle } });
    const data =
      Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
    if (data) {
      return {
        id: data.id.toString(),
        title: data.title,
        handle: data.handle,
        products: data.products || [],
        metadata: data.metadata || null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        deleted_at: data.deleted_at || null,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching collection by handle:", error);
    return null;
  }
};
