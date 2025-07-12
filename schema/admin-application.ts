import z from "zod";

export const adminApplicationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be 50 characters or fewer" })
    .nonempty({ message: "Name is required" }),

  googleMap: z
    .string()
    .url({ message: "Please provide a valid Google Maps URL" })
    .nonempty({ message: "Google Map URL is required" }),

  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters long" })
    .nonempty({ message: "Address is required" }),

  city: z
    .string()
    .min(2, { message: "City name must be at least 2 characters long" })
    .nonempty({ message: "City is required" }),

  pincode: z
    .string()
    .regex(/^\d{6}$/, { message: "Pincode must be a valid 6-digit number" }),

  state: z
    .string()
    .min(2, { message: "State name must be at least 2 characters long" })
    .nonempty({ message: "State is required" }),
});
