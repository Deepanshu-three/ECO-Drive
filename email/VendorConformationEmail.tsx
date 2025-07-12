import * as React from "react";


export function VendorConfirmationEmail(name: string) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <h2 style={{ color: "#0C6170" }}>✅ Vendor Application Received</h2>
      <p>Dear {name},</p>
      <p>
        Thank you for applying to become a vendor on <strong>ECO-Drive</strong>.
        We’ve received your application and will review it shortly.
      </p>
      <p>You’ll be notified once your application is approved.</p>
      <p>Regards,<br />ECO-Drive Team</p>
    </div>
  );
}
