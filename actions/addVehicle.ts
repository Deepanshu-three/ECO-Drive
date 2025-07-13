"use server"
import db from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

interface Data{
    name: string;
    brand: string;
    type: string;
    pricePerDay: number;
    numberPlate: string;
    thumbnailUrl: string;
    vehicleImageUrls: string[];

}
export async function AddVehicle(data: Data) {
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