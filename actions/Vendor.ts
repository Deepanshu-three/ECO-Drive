"use server";
import { AdminVendorEmail } from "@/email/AdminVendorEmail";
import { VendorConfirmationEmail } from "@/email/VendorConformationEmail";
import db from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface data {
  name: string;
  email: string;
  googleMap: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactNumber: string;
}

type vendorPromise =
  | { success: true; message: string }
  | { success: false; message: string };

export async function AddVendor(data: data): Promise<vendorPromise> {
  try {
    const user = await currentUser();

    if (!user) {
      console.warn("User not authenticated.");
      return { success: false, message: "unauthorise" };
    }


    // Step 1: Check or create city
    let cityRecord = await db.city.findFirst({
      where: { name: data.city },
    });

    if (!cityRecord) {
      console.log(`City '${data.city}' not found. Creating new city...`);
      cityRecord = await db.city.create({
        data: { name: data.city },
      });
      console.log("City created:", cityRecord);
    } else {
      console.log("City found:", cityRecord);
    }

    // Step 2: Create vendor
    const vendor = await db.vendor.create({
      data: {
        name: data.name,
        googleMap: data.googleMap,
        address: data.address,
        phoneNumber: data.contactNumber,
        email: data.email,
        city: data.city,
        postalCode: data.pincode,
        state: data.state,
      },
    });


    // Step 3: Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: data.email,
      subject: "Vendor request verified",
      react: VendorConfirmationEmail(data.name),
    });


    return { success: true, message: "Vendor created and emails sent successfully" };

  } catch (error: any) {
    console.error("Unexpected error in SendVendorEmail:", error);
    return { success: false, message: "Internal server error" };
  }
}



export async function GetVendors() {
  try {
    const data = await db.vendor.findMany();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return {
      success: false,
      message: "Failed to fetch vendors",
    };
  }
}

export async function DeleteVendor(id: string): Promise<vendorPromise> {
  try {
    const vendor = await db.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return { success: false, message: "Vendor not found" };
    }

    await db.vendor.delete({
      where: { id },
    });

    revalidatePath("/admin/manage-vendor")
    return { success: true, message: "Vendor deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting vendor:", error);
    return { success: false, message: "Failed to delete vendor" };
  }
}
