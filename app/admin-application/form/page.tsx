"use client";

import { adminApplicationSchema } from "@/schema/admin-application";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const page = () => {
  const form = useForm<z.infer<typeof adminApplicationSchema>>({
    resolver: zodResolver(adminApplicationSchema),
    defaultValues: {
      name: "",
      googleMap: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const onSubmit = (data: z.infer<typeof adminApplicationSchema>) => {
    console.log("Form Submitted:", data);
    // Add your submit logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full mx-auto max-w-2xl border border-gray-200 rounded-xl p-10 shadow-sm bg-white">
        <h1 className="text-center text-4xl font-bold text-[#0C6170] mb-10">
          Vendor Application Form
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name or shop name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Google Map */}
            <FormField
              control={form.control}
              name="googleMap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Google Map Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Paste your Google Maps business location URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street address, building number, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pincode */}
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Pincode</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your area's pincode"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-6">
              Submit Application
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
