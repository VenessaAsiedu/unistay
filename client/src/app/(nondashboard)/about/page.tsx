"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import FooterSection from "../landing/FooterSection";

const values = [
  {
    title: "Students First",
    description:
      "Every listing, feature, and decision is built around what students actually need: affordable, safe, and convenient housing close to campus.",
  },
  {
    title: "Trusted Listings",
    description:
      "We work directly with verified property managers so you never waste time on fake listings or surprise conditions.",
  },
  {
    title: "Simple & Transparent",
    description:
      "Clear pricing, honest photos, and straightforward applications — no hidden fees, no runaround.",
  },
];

const AboutPage = () => {
  return (
    <div className="w-full">
      <section className="relative h-[40vh] min-h-[300px]">
        <Image
          src="/landing-splash.jpg"
          alt="UniStay About Us Hero"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About UniStay</h1>
          <p className="text-lg max-w-2xl">
            Helping students find a place that feels like home.
          </p>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            UniStay was created to solve a problem every student knows too
            well: finding decent accommodation near campus is stressful,
            time-consuming, and full of uncertainty. Listings are scattered,
            photos are misleading, and good rooms are gone before you even hear
            about them.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We bring verified student housing into one place, with powerful
            search tools, real photos, honest pricing, and direct applications —
            so you can spend less time hunting for a room and more time on what
            matters.
          </p>
        </motion.div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-xl shadow-md p-8 text-center"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to find your place?
        </h2>
        <p className="text-gray-600 mb-8">
          Browse hundreds of verified student rentals near your campus.
        </p>
        <Link
          href="/search"
          className="inline-block bg-secondary-500 text-white rounded-lg px-8 py-3 font-semibold hover:bg-secondary-600"
          scroll={false}
        >
          Start Searching
        </Link>
      </section>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
