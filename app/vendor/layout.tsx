// app/admin/layout.tsx
import React from "react";
import Sidebar from "./_components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
