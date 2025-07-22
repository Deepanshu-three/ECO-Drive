"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { getAllVehiclesWithDetails } from "@/actions/Vehicle";
import { getAllCities } from "@/actions/City";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleWithDetails } from "@/types/Vehicle";

function ProductSkeleton() {
  return (
    <div className="animate-pulse border p-4 rounded shadow space-y-4">
      <div className="bg-gray-200 h-48 w-full rounded" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  );
}

interface ProductFilterProps {
  filters: {
    category: string;
    subcategory: string;
    priceMin: number;
    priceMax: number;
    sortOrder: "lowToHigh" | "highToLow" | "";
  };
}

type citis = {
  name: string;
  id: string;
};

export default function ProductsList({ filters }: ProductFilterProps) {
  const router = useRouter();
  const PRODUCTS_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);
  const [allVehicles, setAllVehicles] = useState<VehicleWithDetails[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<
    VehicleWithDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [allCities, setAllCities] = useState<citis[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const totalPages = Math.ceil(filteredVehicles.length / PRODUCTS_PER_PAGE);

  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const fetchVehicles = async () => {
    setLoading(true);
    const res = await getAllVehiclesWithDetails();
    if (res.success) {
      setAllVehicles(res.data ?? []);
      setFilteredVehicles(res.data ?? []);
    } else {
      toast.error(res.message || "Failed to fetch vehicles.");
    }
    setLoading(false);
  };

  const fetchCities = async () => {
    const res = await getAllCities();
    if (res.success) {
      setAllCities(res.data ?? []);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchCities();
  }, []);

  useEffect(() => {
    let filtered = [...allVehicles];

    if (filters.category) {
      filtered = filtered.filter(
        (v) => v.type?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.priceMin !== undefined) {
      filtered = filtered.filter((v) => v.pricePerDay >= filters.priceMin);
    }

    if (filters.priceMax !== undefined) {
      filtered = filtered.filter((v) => v.pricePerDay <= filters.priceMax);
    }

    if (filters.sortOrder === "lowToHigh") {
      filtered = filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    }

    if (filters.sortOrder === "highToLow") {
      filtered = filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
    }

    setFilteredVehicles(filtered);
    setCurrentPage(1);
  }, [filters, allVehicles]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get("fromDate");
    const to = searchParams.get("toDate");

    if (from) {
      const parsedFrom = new Date(from);
      if (!isNaN(parsedFrom.getTime())) {
        setFromDate(parsedFrom);
      }
    }

    if (to) {
      const parsedTo = new Date(to);
      if (!isNaN(parsedTo.getTime())) {
        setToDate(parsedTo);
      }
    }
  }, []);

  const handleSearch = () => {
    let filtered = [...allVehicles];

    if (selectedCity) {
      filtered = filtered.filter(
        (v) => v.vendor?.city?.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    if (fromDate && toDate) {
      filtered = filtered.filter((v) => {
        return v.bookings.every((b: any) => {
          const bookingStart = new Date(b.fromDate);
          const bookingEnd = new Date(b.toDate);
          return toDate <= bookingStart || fromDate >= bookingEnd;
        });
      });
    }

    setFilteredVehicles(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white min-h-screen py-10 px-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-7xl mx-auto mb-8">
        <Select onValueChange={setSelectedCity} defaultValue={selectedCity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {allCities.map(({ id, name }) => (
              <SelectItem key={id} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "PPP") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={setFromDate}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "PPP") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar mode="single" selected={toDate} onSelect={setToDate} />
          </PopoverContent>
        </Popover>

        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full">
            🔍 Search
          </Button>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="w-full max-w-7xl space-y-4 px-4">
        {loading ? (
          Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
        ) : paginatedVehicles.length > 0 ? (
          paginatedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => router.push(`/rent/${vehicle.id}`)}
              className="flex flex-col sm:flex-row justify-between items-start gap-6 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-primary transition-all duration-300 bg-white cursor-pointer"
            >
              {/* Left: Vehicle Image */}
              <div className="w-full sm:w-64 h-44 overflow-hidden rounded-md">
                <img
                  src={vehicle.images[0]?.url}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Middle: Vehicle Info */}
              <div className="flex-1 w-full space-y-2">
                <h3 className="text-2xl font-bold text-[#0C6170]">
                  {vehicle.name}
                </h3>
                <p className="text-gray-600 text-sm">Type: {vehicle.type}</p>
                <p className="text-gray-500 text-sm">
                  City: {vehicle.vendor?.city || "Unknown"}
                </p>
              </div>

              {/* Right: Price + Vendor Info */}
              <div className="flex flex-col items-end gap-3 text-right w-full sm:w-60">
                {/* Price */}
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{vehicle.pricePerDay}
                  </p>
                  <p className="text-sm text-gray-500">per day</p>
                </div>

                {/* Vendor Info */}
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">
                    {vehicle.vendor?.name || "Unknown Vendor"}
                  </p>

                  {/* View on Map */}
                  {vehicle.vendor?.googleMap && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(vehicle.vendor.googleMap, "_blank");
                      }}
                    >
                      📍 View on Map
                    </Button>
                  )}

                  {/* Call Vendor */}
                  {vehicle.vendor?.phoneNumber && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${vehicle.vendor.phoneNumber}`;
                      }}
                    >
                      📞 Call Vendor
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-left text-gray-500">No vehicles found.</p>
        )}
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="mt-12 mb-20 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
