"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import carAnimation from "@/components/carr.json";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";

export default function Hero() {
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const router = useRouter();

  const handleSearch = () => {
    if (fromDate && toDate) {
      router.push(
        `/rent?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`
      );
    }
  };

  return (
    <div className="w-full">
      {/* Header and Animation */}
      <div className="container h-[90vh] mx-auto grid grid-cols-2 justify-center items-center">
        <div className="space-y-2 max-w-xl mx-auto relative">
          <DotLottieReact
            data={carAnimation}
            loop
            autoplay
            speed={0.5}
            className="absolute -top-24 -left-24 -z-10"
          />

          <p className="text-xl">Affordable & Eco-Friendly Vehicle Rentals</p>
          <h1 className="font-bold text-7xl text-[#0C6170]">ECO-Drive</h1>
          <p className="text-xl">
            Drive smarter with ECO-Drive — rent cost-efficient and eco-conscious
            vehicles across India, whenever you need them.
          </p>
          <div className="flex flex-wrap gap-4 mt-10 items-center">
            {/* From Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] h-12 justify-start text-left font-normal bg-white border-gray-300 hover:border-black"
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-600" />
                  {fromDate ? (
                    <span>{format(fromDate, "dd MMM yyyy")}</span>
                  ) : (
                    <span className="text-muted-foreground">From Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 shadow-lg border"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* To Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] h-12 justify-start text-left font-normal bg-white border-gray-300 hover:border-black"
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-600" />
                  {toDate ? (
                    <span>{format(toDate, "dd MMM yyyy")}</span>
                  ) : (
                    <span className="text-muted-foreground">To Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 shadow-lg border"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Search Button */}
            <Button
              className="h-12 px-6 bg-[#0C6170] text-white hover:bg-[#094c59]"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div>
          <Image
            src={"/home/herobackground.png"}
            height={800}
            width={1000}
            alt="eco-drive background"
          />
        </div>
      </div>
    </div>
  );
}
