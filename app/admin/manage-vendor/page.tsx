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
import { DeleteVendor, GetVendors } from "@/actions/Vendor";

type Vendor = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  city: string | null;
};

const Page = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const router = useRouter();

  const fetchVendor = async () => {
    const res = await GetVendors();

    if (res.success && res.data) {
      setVendors(res.data);
    } else {
      toast.error(res.message || "Failed to fetch vendors.");
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  const handleDelete = async (id: string) => {

    const res = await DeleteVendor(id)

    if(res.success){
      toast.success(res.message)
      fetchVendor()
    }else{
      toast.error(res.message)
    }

  };

  const handleProductUpdated = () => {};

  return (
    <div className="max-w-7xl mx-auto p-28">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0C6170]">Vendors</h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading Vendors...</p>
      ) : vendors.length === 0 ? (
        <p className="text-center text-gray-500">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>List of all Vendors</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.city}</TableCell>
                  <TableCell>{vendor.phoneNumber}</TableCell>
                  <TableCell className="flex justify-center gap-2">
                    {/* <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // setEditProduct(product);
                        // setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button> */}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(vendor.id)}
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
