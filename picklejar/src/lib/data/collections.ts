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
  id: number;
  title: string;
  handle: string;
  products: any[];
};

export const listCollections = async (): Promise<Collection[]> => {
  // If you have a /collections endpoint, use it. Otherwise, extract from products or categories.
  const res = await api.get("/collections");
  return res.data;
};

export const getCollectionByHandle = async (
  handle: string
): Promise<Collection | null> => {
  const res = await api.get("/collections", { params: { handle } });
  return Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
};
