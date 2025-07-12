"use client";

import { adminApplicationSchema } from "@/schema/admin-application";
import React, { useState } from "react";
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
import { SendVendorEmail } from "@/actions/sendVendorEmail";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

const page = () => {

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof adminApplicationSchema>>({
    resolver: zodResolver(adminApplicationSchema),
    defaultValues: {
      name: "",
      googleMap: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      contactNumber: "", 
    },
  });

  const onSubmit = async(data: z.infer<typeof adminApplicationSchema>) => {
    setLoading(true)
    const res = await SendVendorEmail(data);

    if(res.success){
      toast.success(res.message)
    }else{
      toast.error(res.message)
    }

    setLoading(false)
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 p-28 bg-gray-50 ">
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
                    <Input placeholder="Your full name or shop name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Number */}
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your 10-digit mobile number"
                      {...field}
                      type="tel"
                      maxLength={10}
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
                    <Input placeholder="Business location URL" {...field} />
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
                    <Input placeholder="Street, building number, etc." {...field} />
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
                    <Input placeholder="Your city" {...field} />
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
                    <Input placeholder="Your state" {...field} />
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
                      type="text"
                      placeholder="6-digit pincode"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-6">
              {loading ? <Loader2Icon  className="animate-spin"/> : "Submit Application"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
