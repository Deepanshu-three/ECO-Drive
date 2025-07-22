import { z } from "zod";
export const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().min(10, "Mobile number is required"),
  license: z.string().min(5, "License number is required"),
  notes: z.string().optional(),
});