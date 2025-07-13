import z from "zod";

export const vendorVehicleSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),

  brand: z.string().min(2, { message: "Brand must be at least 2 characters" }),

  type: z.string().min(1, { message: "Type is required" }),

  pricePerDay: z.number().min(0, { message: "Price must be at least 0" }),

  vehicleImages: z
    .any()
    .refine(
      (files) =>
        Array.isArray(files) &&
        files.length > 0 &&
        files.every((file) => file instanceof File),
      {
        message: "At least one valid product image is required.",
      }
    ),
  thumbnail: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Thumbnail is required and must be a file",
    })
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: "Thumbnail must be less than 5MB",
    }),

    numberPlate: z
    .string()
    .min(5, { message: "Number plate must be at least 5 characters" })
    .max(15, { message: "Number plate must be at most 15 characters" })
    .regex(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, {
      message: "Enter a valid Indian number plate (e.g., RJ14AB1234)",
    }),
});
