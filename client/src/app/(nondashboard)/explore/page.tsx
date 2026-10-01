"use client";

import React from "react";
import Link from "next/link";
import Card from "@/components/Card";
import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { Property } from "@/types/prismaTypes";
import FooterSection from "../landing/FooterSection";

const ExplorePage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  );
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();

  // no filters — every available property
  const { data: properties, isLoading, isError } = useGetPropertiesQuery({});

  const isFavorite = (propertyId: number) =>
    tenant?.favorites?.some((fav: Property) => fav.id === propertyId) || false;

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser) return;

    const args = { cognitoId: authUser.cognitoInfo.userId, propertyId };
    if (isFavorite(propertyId)) {
      await removeFavorite(args);
    } else {
      await addFavorite(args);
    }
  };

  return (
    <div className="w-full">
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Explore Rental Properties</h1>
            <p className="text-gray-600 mt-2">
              Browse every property currently available on UniStay.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-block border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 self-start sm:self-auto"
          >
            Search with filters
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading properties...</p>
        ) : isError || !properties ? (
          <p className="text-red-600">Failed to fetch properties.</p>
        ) : properties.length === 0 ? (
          <p className="text-gray-600">
            No properties are available right now. Check back soon.
          </p>
        ) : (
          <>
            <p className="text-sm font-bold mb-4">
              {properties.length}{" "}
              <span className="text-gray-700 font-normal">
                {properties.length === 1 ? "property" : "properties"} available
              </span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card
                  key={property.id}
                  property={property}
                  isFavorite={isFavorite(property.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                  showFavoriteButton={!!authUser}
                  propertyLink={`/search/${property.id}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
      <FooterSection />
    </div>
  );
};

export default ExplorePage;
