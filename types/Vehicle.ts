export interface AddVehicleData{
    name: string;
    brand: string;
    type: string;
    pricePerDay: number;
    numberPlate: string;
    thumbnailUrl: string;
    vehicleImageUrls: string[];

}

export interface Vehicle {
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
export interface GetVendorVehiclesResponse {
  success: boolean;
  data?: Vehicle[];
  message?: string;
}

// types/vehicle.ts

export type VehicleWithDetails = {
  id: string;
  name: string;
  brand: string;
  type: string;
  numberPlate: string;
  pricePerDay: number;
  thumbnail: string;
  createdAt: Date;
  vendor: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    googleMap: string;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    createdAt: Date;
  };
  bookings: {
    id: string;
    fromDate: Date; // ✅ Fix here
    toDate: Date;   // ✅ Fix here
  }[];
  images: {
    id: string;
    url: string;
  }[];
};

export interface GetVehiclesDetails {
  success: boolean;
  data?: VehicleWithDetails[];
  message?: string;
}


