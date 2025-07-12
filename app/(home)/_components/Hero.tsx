"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import carAnimation from "@/components/carr.json";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // Optional utility
import Image from "next/image";

export default function Hero() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="w-full">
      {/* Header and Animation */}
      <div className="container h-[90vh]  mx-auto grid grid-cols-2 justify-center items-center">
        <div className="space-y-2 max-w-xl mx-auto relative -z-20">
          <div className="">
            <DotLottieReact
              data={carAnimation}
              loop
              autoplay
              speed={0.5}
              className="absolute -top-24 -left-24"
            />
          </div>
          <p className="text-xl">Affordable & Eco-Friendly Vehicle Rentals</p>
          <h1 className="font-bold text-7xl text-[#0C6170]">ECO-Drive</h1>
          <p className="text-xl ">
            Drive smarter with ECO-Drive — rent cost-efficient and eco-conscious
            vehicles across India, whenever you need them.
          </p>

          <div className="flex gap-2 mt-10">
            <Input placeholder="Pick Up" className="h-12" />
            <Input placeholder="Date" className="h-12" />
            <Button className="h-12">Search</Button>
          </div>
        </div>

        <div>
          <Image
            src={"/home/herobackground.png"}
            height={800}
            width={1000}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
