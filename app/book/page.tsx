"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "@/schema/book-vehicle";
import { startTransition, useCallback, useEffect, useState } from "react";
import { GetVehicleById } from "@/actions/Vehicle";
import { VehicleWithDetails } from "@/types/Vehicle";
import { toast } from "sonner";
import Script from "next/script";
import axios from "axios";
import { createBooking } from "@/actions/book";

type BookingForm = z.infer<typeof bookingSchema>;

export default function BookPage() {
  const searchParams = useSearchParams();
  const router = useRouter()

  const [vehicle, setVehicle] = useState<VehicleWithDetails | null>(null);

  const vehicleId = searchParams.get("vehicleId");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const [amount, setAmount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
  if (fromDate && toDate && vehicle?.pricePerDay) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const total = days * vehicle.pricePerDay;
    setAmount(total);
  }
}, [fromDate, toDate, vehicle]);



  const onSubmit = async (data: BookingForm) => {
    try {

      // Call your API to create the Razorpay order
      const response = await axios.post("/api/createOrder", { amount });

      const { id: orderId, amount: orderAmount, currency } = response.data;

      // Proceed with Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID!,
        amount: orderAmount,
        currency,
        order_id: orderId,
        name: "Eco-Drive",
        description: "Vehicle Booking Payment",
         handler: function (response: any) {
        console.log("Payment successful:", response);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("phoneNumber", data.mobile);
        formData.append("licenseNo", data.license);
        formData.append("vehicleId", vehicle?.id!);
        formData.append("vendorId", vehicle?.vendor.id!);
        formData.append("fromDate", fromDate!);
        formData.append("toDate", toDate!);
        formData.append("razorpayOrderId", orderId);
        formData.append("razorpayPaymentId", response.razorpay_payment_id);
        formData.append("razorpaySignature", response.razorpay_signature);

        startTransition(() => {
          createBooking(formData).then((res) => {
            if (res?.success) {
              toast.success("Booking successful!");
              router.push("/bookings");
            } else {
              toast.error("Booking failed!");
            }
          });
        });
      },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  const fetchVehicleDetails = useCallback(async () => {
    const res = await GetVehicleById(vehicleId as string);
    if (res.success) {
      setVehicle(res.data ?? null);
    } else {
      toast.error(res.message);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicleDetails();
  }, [vehicleId]);

  return (
    <div className="max-w-3xl mx-auto py-24 px-4 space-y-8">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">
              Vehicle ID
            </span>
            <span className="font-semibold">{vehicle?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">
              Vehicle Name
            </span>
            <span className="font-semibold">{vehicle?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">
              Vendor Name
            </span>
            <span className="font-semibold">{vehicle?.vendor.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">From Date</span>
            <span className="font-semibold">
              {fromDate ? format(new Date(fromDate), "PPP") : "Not provided"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">To Date</span>
            <span className="font-semibold">
              {toDate ? format(new Date(toDate), "PPP") : "Not provided"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">
              Price Per Day
            </span>
            <span className="font-semibold text-blue-600">
              ₹{vehicle?.pricePerDay ?? "N/A"}
            </span>
          </div>

          {fromDate && toDate && vehicle?.pricePerDay && (
            <div className="flex justify-between border-t pt-4 mt-4">
              <span className="text-lg font-semibold">Total Price</span>
              <span className="text-xl font-bold text-green-600">
                  ₹{amount}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Enter Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="John Doe" />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                {...register("mobile")}
                placeholder="+91-9876543210"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="license">Driving License Number</Label>
              <Input
                id="license"
                {...register("license")}
                placeholder="DL-1234567890"
              />
              {errors.license && (
                <p className="text-red-500 text-sm">{errors.license.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Any special instructions..."
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Confirm Booking
            </Button>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Booking Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>✔️ All bookings must be made at least 2 hours in advance.</p>
          <p>
            ✔️ A valid driving license must be presented at the time of pickup.
          </p>
          <p>✔️ Cancellation charges may apply as per company policy.</p>
          <p>✔️ Fuel charges are not included unless stated otherwise.</p>
          <p>✔️ Damages will be evaluated and charged as per inspection.</p>
        </CardContent>
      </Card>
    </div>
  );
}
