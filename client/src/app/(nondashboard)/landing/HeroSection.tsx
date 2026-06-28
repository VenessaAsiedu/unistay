"use client";

import Image from "next/image";
import React, { useState } from "react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
  className="relative"
  style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
>
      <Image
        src="/landing-splash.jpg"
        alt="Unistay Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 -translate-y-1/2 text-center w-full"
      >
        <div className="max-w-4xl mx-auto px-16 sm:px-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Start your journey to finding the perfect place to call home
          </h1>
          <p className="text-xl text-white mb-8">
            Explore our wide range of rental properties tailored to fit your lifestyle and needs!
          </p>
          <div className="flex justify-center">
  <Input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search by city, neighbourhood or address"
    className="w-full max-w-2xl rounded-none rounded-l-xl border-none bg-white h-14 px-4 text-base"
  />
  <Button
  onClick={() => {}}
  className="bg-[#eb8686] text-white rounded-none rounded-r-xl border-none hover:bg-[#e45a5a] h-14 px-8 font-semibold text-base"
>
  Search
</Button>
</div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;