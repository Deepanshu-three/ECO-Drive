"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBookingsByEmail } from "@/actions/book";

interface BookingResponse {
  success: boolean;
  bookings?: any[];
  message?: string;
}

const BookingPage = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const res: BookingResponse = await getBookingsByEmail();

      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-10 text-center">My Bookings</h1>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="rounded-2xl shadow-md border border-gray-200 flex flex-col sm:flex-row overflow-hidden"
            >
              <div className="relative w-full sm:w-1/3 h-56 sm:h-auto">
                <Image
                  src={booking.vehicle.images[0]?.url || "/placeholder.jpg"}
                  alt={booking.vehicle.name}
                  fill
                  className="object-cover"
                />
              </div>

              <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h2 className="text-2xl font-semibold">{booking.vehicle.name}</h2>
                  <p className="text-sm text-muted-foreground">Vendor: {booking.vendor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {new Date(booking.fromDate).toLocaleDateString()} -{" "}
                    {new Date(booking.toDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ₹{booking.vehicle.pricePerDay} / day
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      booking.paymentStatus === "SUCCESS"
                        ? "default"
                        : booking.paymentStatus === "PENDING"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {booking.paymentStatus}
                  </Badge>
                  <p className="text-sm text-gray-500">
                    Booking ID: <span className="font-mono">{booking.id.slice(0, 8)}...</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
