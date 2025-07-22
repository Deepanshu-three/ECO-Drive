"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, CalendarIcon, LocationEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageCarousel from "@/components/ImageCarousel";
import { VehicleWithDetails } from "@/types/Vehicle";
import { GetVehicleById } from "@/actions/Vehicle";
import { checkVehicleAvailability } from "@/actions/Vehicle";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />
      ))}
      {hasHalfStar && (
        <Star className="w-6 h-6 fill-yellow-400/50 stroke-yellow-400/50" />
      )}
      <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const [vehicle, setVehicle] = useState<VehicleWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const router = useRouter();

  const fetchVehicleDetails = useCallback(async () => {
    const res = await GetVehicleById(id as string);
    if (res.success) {
      setVehicle(res.data ?? null);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!fromDate || !toDate || !vehicle?.id) return;

      setCheckingAvailability(true);
      try {
        const result = await checkVehicleAvailability({
          vehicleId: vehicle.id,
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
        });
        setIsAvailable(result.available);
      } catch {
        toast.error("Error checking availability");
        setIsAvailable(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [fromDate, toDate, vehicle]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white px-6 py-12 pt-28">
        <div className="max-w-5xl mx-auto animate-pulse space-y-10">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2 h-96 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-gray-200 rounded-md w-3/4" />
              <div className="h-6 bg-gray-200 rounded-md w-1/2" />
              <div className="h-6 bg-gray-200 rounded-md w-full" />
              <div className="h-10 bg-gray-200 rounded-md w-1/3" />
              <div className="h-8 bg-gray-200 rounded-md w-1/4" />
              <div className="h-6 bg-gray-200 rounded-md w-1/3" />
              <div className="h-12 bg-gray-200 rounded-md w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle && !loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-xl">
        Product not found
      </div>
    );
  }

  const rating = 4;

  return (
    <div className="w-full min-h-screen bg-white pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2">
            {vehicle?.images && <ImageCarousel images={vehicle.images} />}
          </div>

          <div className="flex-1 space-y-4 text-base sm:text-lg">
            <h1 className="text-3xl sm:text-4xl font-bold">{vehicle!.name}</h1>
            <StarRating rating={rating} />
            <div className="text-2xl sm:text-3xl font-semibold text-primary">
              ₹{vehicle!.pricePerDay}/day
            </div>

            <Badge className="w-fit mt-2 text-sm sm:text-base px-3 py-1">
              Category: {vehicle!.type!}
            </Badge>

           <div className="my-2">
             <p className="text-black font-semibold">
              Vendor Name: <span>{vehicle?.vendor.name}</span>
            </p>

            <div className="space-y-2">
              <p className="text-black font-semibold">Pick Up Location:</p>

              <div className="mt-2 flex gap-2 items-center">
                <LocationEdit />
                <div className="text-sm">
                  <p>{vehicle?.vendor.address}</p>
                  <p>
                    {vehicle?.vendor.city}, {vehicle?.vendor.postalCode}
                  </p>
                  <p> {vehicle?.vendor.state}</p>
                </div>
              </div>
            </div>

           <p className="text-black font-semibold">
              Vendor PhoneNo: <span>+91{vehicle?.vendor.phoneNumber}</span>
            </p>
           </div>

            {/* Date pickers */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* From Date */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? (
                        format(fromDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? (
                        format(toDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Availability message */}
            {fromDate && toDate && (
              <div className="text-sm mt-2">
                {checkingAvailability ? (
                  <span className="text-gray-500">
                    Checking availability...
                  </span>
                ) : isAvailable ? (
                  <span className="text-green-600">
                    Vehicle is available ✅
                  </span>
                ) : (
                  <span className="text-red-600">
                    Vehicle is not available ❌
                  </span>
                )}
              </div>
            )}

            <div className="pt-2">
              <Button
                className="w-full text-base sm:text-lg py-5"
                onClick={() => {
                  if (!fromDate || !toDate) {
                    toast.error("Please select both From and To dates.");
                    return;
                  }

                  if (isAvailable === false) {
                    toast.error("Vehicle is not available for selected dates.");
                    return;
                  }

                  if (isAvailable === null) {
                    toast.error("Checking availability. Please wait...");
                    return;
                  }

                  toast.success(
                    `Vehicle is available. Proceed to book from ${format(fromDate, "PPP")} to ${format(toDate, "PPP")}`
                  );

                  router.push(
                    `/book?vehicleId=${vehicle!.id}&fromDate=${fromDate!.toISOString()}&toDate=${toDate!.toISOString()}`
                  );
                }}
                disabled={checkingAvailability}
              >
                {checkingAvailability ? "Checking..." : "Book Now"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-10 text-sm sm:text-base lg:text-lg">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Product Details</h2>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Additional Information
            </h2>
          </div>

          <div className="max-w-md bg-white border border-gray-300 rounded-md shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-5 text-gray-900">
              Manufacture Information
            </h2>
            <ul className="text-gray-700 space-y-3">
              <li className="flex">
                <strong className="w-32">Brand:</strong>
                <span>{vehicle!.brand || "NA"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
