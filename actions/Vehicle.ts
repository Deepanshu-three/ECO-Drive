"use server"
import db from "@/lib/prisma";
import { AddVehicleData, GetVehicleOnesDetails, GetVehiclesDetails, GetVendorVehiclesResponse, VehicleWithDetails } from "@/types/Vehicle";
import { currentUser } from "@clerk/nextjs/server";


export async function AddVehicle(data: AddVehicleData) {
  try {

    const user = await currentUser()

    if (!user) {
      console.warn("User not authenticated.");
      return { success: false, message: "unauthorise" };
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if(!email){
        return {success: false, message: "email not found"}
    }

    const vendor = await db.vendor.findUnique({
        where: {
            email
        }
    })

    if(!vendor){
        return {success: false, message: "invalid vendor"}
    }

    const vehicle = await db.vehicle.create({
      data: {
        name: data.name,
        brand: data.brand,
        type: data.type,
        pricePerDay: data.pricePerDay,
        thumbnail: data.thumbnailUrl,
        numberPlate: data.numberPlate,
        vendorId: vendor.id,
        images: {
          create: data.vehicleImageUrls.map((url) => ({
            url,
          })),
        },
      },
    });

    return {
      success: true,
      message: "Vehicle created successfully",
    };
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    return {
      success: false,
      message: "Something went wrong while adding vehicle",
    };
  }
}




export async function GetVendorVehicles(): Promise<GetVendorVehiclesResponse>  {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return {
        success: false,
        message: "Email not found",
      };
    }

    const vendor = await db.vendor.findUnique({
      where: { email },
    });

    if (!vendor) {
      return {
        success: false,
        message: "Vendor not found",
      };
    }

    const vehicles = await db.vehicle.findMany({
      where: {
        vendorId: vendor.id,
      },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "vehicles fetched successfully",
      data: vehicles,
    };
  } catch (error) {
    console.error("Error fetching vendor vehicles:", error);
    return {
      success: false,
      message: "Something went wrong while fetching vehicles",
    };
  }
}


export async function DeleteVehicle(id: string) {
  try {
    await db.vehicle.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return {
      success: false,
      message: "Failed to delete vehicle",
    };
  }
}



export async function getAllVehiclesWithDetails(): Promise<GetVehiclesDetails> {
  try {
    const vehicles = await db.vehicle.findMany({
      include: {
        vendor: true,
        bookings: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: vehicles,
    };
  } catch (error) {
    console.error("Error fetching vehicles with details:", error);
    return {
      success: false,
      message: "Failed to fetch vehicle details",
    };
  }
}


export async function GetVehicleById(id: string): Promise<GetVehicleOnesDetails> {
  try {
    const vehicle = await db.vehicle.findUnique({
      where: {
        id,
      },
      include: {
        vendor: true,
        bookings: true,
        images: true,
      },
    });

    if (!vehicle) {
      return {
        success: false,
        message: "Vehicle not found",
      };
    }

    return {
      success: true,
      data: vehicle,
    };
  } catch (error) {
    console.error("Error fetching vehicle", error);
    return {
      success: false,
      message: "Failed to fetch vehicle details",
    };
  }
}



export async function checkVehicleAvailability({
  vehicleId,
  fromDate,
  toDate,
}: {
  vehicleId: string;
  fromDate: string; // ISO string
  toDate: string;   // ISO string
}): Promise<{ available: boolean }> {
  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (to <= from) {
    throw new Error('Invalid date range');
  }

  // Get all bookings for this vehicle that overlap with the requested interval
  const overlappingBookings = await db.booking.findMany({
    where: {
      vehicleId,
      AND: [
        {
          fromDate: {
            lte: to,
          },
        },
        {
          toDate: {
            gte: from,
          },
        },
      ],
    },
  });

  return {
    available: overlappingBookings.length === 0,
  };
}
