"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import db from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const bookingSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().min(10),
  licenseNo: z.string().min(5),
  vehicleId: z.string().cuid(),
  vendorId: z.string().cuid(),
  fromDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid fromDate",
  }),
  toDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid toDate",
  }),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

export async function createBooking(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const parse = bookingSchema.safeParse(rawData);

  const user = await currentUser();

  if (!user) {
    console.warn("User not authenticated.");
    return { success: false, message: "unauthorise" };
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (!email) {
    return { success: false, message: "email not found" };
  }

  if (!parse.success) {
    console.error("Validation Error:", parse.error.format());
    return { success: false, errors: parse.error.flatten().fieldErrors };
  }

  const data = parse.data;

  try {
    const booking = await db.booking.create({
      data: {
        name: data.name,
        email: email,
        phoneNumber: data.phoneNumber,
        licenseNo: data.licenseNo,
        vehicleId: data.vehicleId,
        vendorId: data.vendorId,
        fromDate: new Date(data.fromDate),
        toDate: new Date(data.toDate),
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
      },
    });

    revalidatePath("/bookings"); // or wherever you show bookings
    return { success: true, booking };
  } catch (err) {
    console.error("Booking Error:", err);
    return { success: false, message: "Something went wrong while booking." };
  }
}



export async function getBookingsByEmail() {
 
  const user = await currentUser();

  if (!user) {
    console.warn("User not authenticated.");
    return { success: false, message: "unauthorise" };
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (!email) {
    return { success: false, message: "email not found" };
  }
 

  try {
    const bookings = await db.booking.findMany({
      where: { email },
      include: {
        vehicle: {
          include: {
            images: true,
          },
        },
        vendor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, bookings };
  } catch (error) {
    console.error('Error fetching bookings by email:', error);
    return { success: false, message: 'Failed to fetch bookings' };
  }
}