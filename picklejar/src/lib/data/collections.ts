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
};

export const listCollections = async (): Promise<Collection[]> => {
  try {
    const res = await api.get("/collections");
    return Array.isArray(res.data)
      ? res.data
          .map((collection: any) => ({
            id: collection.id?.toString(),
            title: collection.title,
          }))
          .filter(
            (collection): collection is Collection =>
              collection.id &&
              collection.title &&
              typeof collection.title === "string"
          )
      : [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};
