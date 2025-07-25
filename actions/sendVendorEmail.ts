"use server";
import { AdminVendorEmail } from "@/email/AdminVendorEmail";
import { VendorConfirmationEmail } from "@/email/VendorConformationEmail";
import { resend } from "@/lib/resend";
import { EmailData, SendVendorEmailResult } from "@/types/Email";
import { currentUser } from "@clerk/nextjs/server";
import { email } from "zod";


export async function SendVendorEmail(
  data: EmailData
): Promise<SendVendorEmailResult> {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, message: "unauthorise" };
    }

    const name = user.fullName!;

    if (!email) {
      return { success: false, message: "No email found for user" };
    }

    // Send email to Admin
    const adminRes = await resend.emails.send({
      from: "ECO Drive <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: "New Vendor Application Received",
      react: AdminVendorEmail(data),
    });

    if (adminRes.error) {
      console.log(adminRes.error);

      return { success: false, message: "Failed to send admin email" };
    }

    // Send confirmation email to vendor
    const vendorRes = await resend.emails.send({
      from: "ECO Drive <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: "Vendor Application Received",
      react: VendorConfirmationEmail(name),
    });

    if (vendorRes.error) {
      console.log(vendorRes.error);
      return { success: false, message: "Failed to send confirmation email" };
    }

    return { success: true, message: "Emails sent successfully" };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, message: "Internal server error" };
  }
}
