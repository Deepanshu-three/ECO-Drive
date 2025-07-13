export interface EmailData {
  name: string;
  googleMap: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactNumber: string;
  email: string
}

export type SendVendorEmailResult =
  | { success: true; message: string }
  | { success: false; message: string };
