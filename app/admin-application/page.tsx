import Link from "next/link";

const page = () => {
  return (
    <div className="container mx-auto pt-28 px-4 max-w-4xl">
      <h1 className="text-[#0C6170] font-bold text-4xl text-center mb-12">
        How to Become a Vendor on ECO-Drive
      </h1>

      {/* Step 1 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Create an Account</h2>
        <p className="text-gray-600 leading-relaxed">
          Sign up using your Google account or email. Make sure your contact details are correct — we’ll use them to reach you.
        </p>
      </div>

      {/* Step 2 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Apply as a Vendor</h2>
        <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
          <li>Click the <span className="font-medium">“Apply as Vendor”</span> button on your dashboard or visit <Link href={"/admin-application/form"}  className="text-blue-600 underline cursor-pointer">Apply Now</Link>.</li>
          <li>Fill out the Vendor Application Form with the following details:
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Business/Brand Name</li>
              <li>Complete Address</li>
              <li>City, State, and Pincode</li>
              <li>Google Map link for your location</li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Step 3 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Application Review</h2>
        <p className="text-gray-600 leading-relaxed">
          Our team will review your application within <span className="font-medium">1–3 business days</span>. You’ll be notified via email once your application is:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2 text-gray-600 space-y-1">
          <li><span className="text-green-700 font-medium">Approved</span> — you’ll get access to your vendor dashboard.</li>
          <li><span className="text-red-600 font-medium">Rejected</span> — you can contact support or reapply later.</li>
        </ul>
      </div>

      {/* Step 4 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 4: Start Listing Your Vehicles</h2>
        <p className="text-gray-600 leading-relaxed">
          Once approved, you’ll gain access to the Vendor Dashboard where you can:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2 text-gray-600 space-y-1">
          <li>Add vehicles with photos, availability, and pricing</li>
          <li>Edit or remove your listings anytime</li>
          <li>Track your earnings and manage your fleet</li>
        </ul>
      </div>

      {/* Step 5 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 5: Manage Your Bookings</h2>
        <p className="text-gray-600 leading-relaxed">
          View upcoming rental requests, accept or decline them, and communicate with renters easily through your dashboard.
        </p>
      </div>

      {/* Notes */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Additional Notes:</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Only approved vendors can access the vendor/admin panel.</li>
          <li>You can track your application status from your profile.</li>
          <li>All applications are manually reviewed to maintain trust and quality.</li>
        </ul>
      </div>

      {/* Contact */}
      <div className="text-center text-gray-700">
        <p className="text-lg font-medium">Need help?</p>
        <p>📧 Email us at <a href="mailto:support@ecodrive.com" className="text-blue-600 underline">support@ecodrive.com</a></p>
      </div>
    </div>
  );
};

export default page;
