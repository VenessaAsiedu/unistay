"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import { cleanParams } from "@/lib/utils";
import { setFilters } from "@/state";
import Map from "./Map";
import Listings from "./Listings";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "priceRange" || key === "squareFeet") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else {
          acc[key] = value === "any" ? null : value;
        }

        return acc;
      },
      {}
    );

    const cleanedFilters = cleanParams(initialFilters);
    dispatch(setFilters(cleanedFilters));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="w-full mx-auto px-3 sm:px-5 flex flex-col"
      style={{
        height: `calc(100dvh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <FiltersBar />
      {/* phones & tablets: map strip above the listings; desktop: side by side */}
      <div className="relative flex flex-col lg:flex-row justify-between flex-1 min-h-0 overflow-hidden gap-3 mb-3 lg:mb-5">
        <div
          className={`overflow-auto transition-all duration-300 ease-in-out lg:static lg:h-full lg:block ${
            isFiltersFullOpen
              ? "absolute inset-0 z-20 bg-white w-full lg:w-3/12 opacity-100 visible"
              : "hidden lg:w-0 lg:opacity-0 lg:invisible"
          }`}
        >
          <FiltersFull />
        </div>
        <Map />
        <div className="flex-1 min-h-0 lg:flex-none lg:basis-4/12 overflow-y-auto">
          <Listings />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
