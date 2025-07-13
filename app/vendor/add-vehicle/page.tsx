"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { vendorVehicleSchema } from "@/schema/add-vehivle";
import {
  uploadMultipleImagesAction,
  uploadSingleImageAction,
} from "@/actions/imageUploader";
import { AddVehicle } from "@/actions/Vehicle";

type VendorVehicleType = z.infer<typeof vendorVehicleSchema>;

const Page = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<VendorVehicleType>({
    resolver: zodResolver(vendorVehicleSchema),
    defaultValues: {
      name: "",
      brand: "",
      type: "",
      pricePerDay: 0,
      vehicleImages: [],
      thumbnail: undefined,
      numberPlate: "",
    },
  });

  const onSubmit = async (data: VendorVehicleType) => {
    setLoading(true);

    try {
      // Upload thumbnail
      const thumbnailForm = new FormData();
      thumbnailForm.append("file", data.thumbnail as File);

      const thumbnailRes = await uploadSingleImageAction(thumbnailForm);
      if (!thumbnailRes.success) throw new Error(thumbnailRes.message);

      // Upload multiple images
      const imagesForm = new FormData();
      data.vehicleImages.forEach((file: any) => {
        imagesForm.append("files", file);
      });

      const imagesRes = await uploadMultipleImagesAction(imagesForm);
      if (!imagesRes.success) throw new Error(imagesRes.message);

      const vehicleData = {
        name: data.name,
        brand: data.brand,
        type: data.type,
        pricePerDay: data.pricePerDay,
        numberPlate: data.numberPlate,
        thumbnailUrl: thumbnailRes.imageUrl!,
        vehicleImageUrls: imagesRes.imageUrls!,
      };

      const res = await AddVehicle(vehicleData)

      if(res.success){
        toast.success(res.message);
      }else{
        toast.error(res.message)
      }

      form.reset();

    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 p-28 bg-gray-50">
      <div className="w-full mx-auto max-w-2xl border border-gray-200 rounded-xl p-10 shadow-sm bg-white">
        <h1 className="text-center text-4xl font-bold text-[#0C6170] mb-10">
          Add a Vehicle
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Vehicle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Vehicle brand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-2 border rounded-md border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select a type</option>
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                      <option value="Scooter">Scooter</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Per Day */}
            <FormField
              control={form.control}
              name="pricePerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Per Day (in ₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 500" {...field}   onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number Plate */}
            <FormField
              control={form.control}
              name="numberPlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number Plate</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. RJ14AB1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { onChange, ref, ...field } }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={ref}
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Images */}
            <FormField
              control={form.control}
              name="vehicleImages"
              render={({ field: { onChange, ref } }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={ref}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          // Create a fresh copy of the FileList as an array
                          const fileArray = Array.from(files);
                          onChange(fileArray);
                        } else {
                          onChange([]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-6">
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Submit Vehicle"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
