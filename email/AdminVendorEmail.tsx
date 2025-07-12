import * as React from "react";

interface AdminVendorEmailProps {
  name: string;
  contactNumber: string;
  googleMap: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export function AdminVendorEmail({
  name,
  contactNumber,
  googleMap,
  address,
  city,
  state,
  pincode,
}: AdminVendorEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <h2 style={{ color: "#0C6170" }}>🚗 New Vendor Application</h2>
      <p>A new vendor has applied on ECO-Drive. Here are the details:</p>
      <ul>
        <li><strong>Name:</strong> {name}</li>
        <li><strong>Contact Number:</strong> {contactNumber}</li>
        <li><strong>Google Map:</strong> <a href={googleMap}>{googleMap}</a></li>
        <li><strong>Address:</strong> {address}</li>
        <li><strong>City:</strong> {city}</li>
        <li><strong>State:</strong> {state}</li>
        <li><strong>Pincode:</strong> {pincode}</li>
      </ul>
      <p>Please review and take appropriate action.</p>
    </div>
  );
}
