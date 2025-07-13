"use server"

import db from "@/lib/prisma";

interface data{
    success: boolean;
    data?: {
        id: string;
        name: string;
    }[];
    message?: string
}

export async function getAllCities(): Promise<data> {
  try {
    const cities = await db.city.findMany();

    return {
      success: true,
      data: cities,
    };

  } catch (error) {
    console.error("Error fetching cities:", error);
    return {
      success: false,
      message: "Failed to fetch cities",
    };
  }
}