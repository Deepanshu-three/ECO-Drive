"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GetVendorVehicles, DeleteVehicle } from "@/actions/Vehicle"; // 👈 import DeleteVehicle

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: string;
  pricePerDay: number;
  thumbnail: string;
  numberPlate: string;
  createdAt: Date;
  images: {
    id: string;
    url: string;
  }[];
}

const Page = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchVehicles = async () => {
    setLoading(true);
    const res = await GetVendorVehicles();

    if (res.success && res.data) {
      setVehicles(res.data);
    } else {
      toast.error(res.message || "Failed to fetch vehicles.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this vehicle?");
    if (!confirmed) return;

    const res = await DeleteVehicle(id);
    if (res.success) {
      toast.success("Vehicle deleted successfully");
      fetchVehicles(); // refresh the list
    } else {
      toast.error(res.message || "Failed to delete vehicle");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0C6170]">Your Vehicles</h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading Vehicles...</p>
      ) : vehicles.length === 0 ? (
        <p className="text-center text-gray-500">No vehicles found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>List of all your uploaded vehicles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price / Day</TableHead>
                <TableHead>Number Plate</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.brand}</TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell>₹{v.pricePerDay}</TableCell>
                  <TableCell>{v.numberPlate}</TableCell>
                  <TableCell>{new Date(v.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(v.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Page;
