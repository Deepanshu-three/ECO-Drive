"use client";

import { FilterIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductsList from "./Product";

const staticCategories = [
  { id: "bike", name: "Bike" },
  { id: "car", name: "Car" },
  { id: "scooter", name: "Scooter" },
];

type SortOrder = "lowToHigh" | "highToLow" | "";

function SidebarWithFilters() {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortOrder, setSortOrder] = useState<SortOrder>("");

  const filters = {
    category: selectedCategory,
    subcategory: selectedSubcategory,
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    sortOrder,
  };

  const FilterUI = (
    <>
      <h2 className="text-2xl font-semibold text-primary mb-4">Filters</h2>
      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full p-2 border rounded bg-background"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {staticCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-1">Price Range (₹)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-2 border rounded bg-background"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: +e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 border rounded bg-background"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: +e.target.value })
              }
            />
          </div>
        </div>

        {/* Sort by Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Sort by Price</label>
          <select
            className="w-full p-2 border rounded bg-background"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="">Default</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block w-[400px] min-h-screen border-r p-10 mt-10  bg-muted/10">
        {FilterUI}
      </div>

      {/* Mobile Filter Button */}
      <div className="flex-1">
        <div className="md:hidden sticky top-16 z-30 bg-background border-b p-3 flex justify-between items-center">
          <span className="text-lg font-semibold">Products</span>
          <Sheet open={isFilterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[350px] p-4 space-y-4">
              {FilterUI}
            </SheetContent>
          </Sheet>
        </div>

        {/* Product Listing */}
        <div className="p-4">
          <ProductsList filters={filters} />
        </div>
      </div>
    </div>
  );
}

export default SidebarWithFilters;
