"use client";

import {
  BookIcon,
  BoxesIcon,
  CarIcon,
  Coins,
  HomeIcon,
  Layers,
  Layers2Icon,
  MenuIcon,
  Printer,
  UserIcon,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const routes = [
  {
    href: "/vendor",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/vendor/add-vehicle",
    label: "Add a vehicle",
    icon: CarIcon,
  },
  {
    href: "/vendor/manage-vehicle",
    label: "Manage vehicle",
    icon: UserIcon
  },
  {
    href: "/vendor/bookings",
    label: "Bookings",
    icon: BookIcon
  },
  {
    href: "/vendors/credits",
    label: "Creadits",
    icon: Coins
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const renderLinks = () => (
    <div className="flex flex-col gap-2 p-4">
      {routes.map((route) => {
        // Highlight Home only on exact match, others if pathname starts with route.href
        const isActive =
          route.href === "/vendor"
            ? pathname === "/vendor"
            : pathname.startsWith(route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            className={buttonVariants({
              variant: isActive ? "default" : "ghost",
              className: "w-full justify-start gap-3 text-base font-medium",
            })}
            onClick={() => setIsOpen(false)}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-100 border-b bg-background px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0">
              {renderLinks()}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-[260px] flex-col border-r bg-muted/10 dark:bg-muted/20 mt-20">
        <div className="text-xl font-semibold p-4">Admin</div>
        {renderLinks()}
      </aside>
    </>
  );
}
