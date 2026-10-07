"use client";

import Loading from "@/components/Loading";
import {
  useGetAuthUserQuery,
  useGetLeasesQuery,
  useGetPropertyQuery,
} from "@/state/api";
import { Lease, Property } from "@/types/prismaTypes";
import {
  Download,
  MapPin,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import ManagerContactModal from "@/components/ManagerContactModal";

const ResidenceCard = ({
  property,
  currentLease,
  onOpenManagerModal,
}: {
  property: Property;
  currentLease: Lease;
  onOpenManagerModal: () => void;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 w-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex gap-5">
        <div className="w-64 h-32 object-cover bg-slate-500 rounded-xl overflow-hidden">
          {property.image ? (
            <img 
              src={property.image} 
              alt={property.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="bg-green-500 w-fit text-white px-4 py-1 rounded-full text-sm font-semibold">
              Active Lease
            </div>

            <h2 className="text-2xl font-bold my-2">{property.name}</h2>
            <div className="flex items-center mb-2 text-gray-500">
              <MapPin className="w-5 h-5 mr-1" />
              <span>
                {property.location.city}, {property.location.country}
              </span>
            </div>
          </div>
          <div className="text-xl font-bold">
            ${currentLease.rent}{" "}
            <span className="text-gray-500 text-sm font-normal">/ night</span>
          </div>
        </div>
      </div>
      {/* Dates */}
      <div>
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <div className="xl:flex">
            <div className="text-gray-500 mr-2">Start Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.startDate).toLocaleDateString()}
            </div>
          </div>
          <div className="border-[0.5px] border-gray-300 h-4" />
          <div className="xl:flex">
            <div className="text-gray-500 mr-2">End Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
          <div className="border-[0.5px] border-gray-300 h-4" />
          <div className="xl:flex">
            <div className="text-gray-500 mr-2">Next Payment: </div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      {/* Buttons */}
      <div className="flex justify-end gap-2 w-full">
        <button 
          onClick={onOpenManagerModal}
          className="bg-zinc-900 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-zinc-800 transition cursor-pointer"
        >
          <User className="w-5 h-5 mr-2" />
          Manager
        </button>
        <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
          <Download className="w-5 h-5 mr-2" />
          Download Agreement
        </button>
      </div>
    </div>
  );
};

const Residence = () => {
  const { id } = useParams();
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: property,
    isLoading: propertyLoading,
    error: propertyError,
  } = useGetPropertyQuery(Number(id));

  const { data: leases, isLoading: leasesLoading } = useGetLeasesQuery(
    parseInt(authUser?.cognitoInfo?.userId || "0"),
    { skip: !authUser?.cognitoInfo?.userId }
  );
  const currentLease = leases?.find(
    (lease) => lease.propertyId === Number(id)
  );

  if (propertyLoading || leasesLoading) return <Loading />;
  if (!property || propertyError) return <div>Error loading property</div>;

  return (
    <>
      <div className="dashboard-container">
        <div className="w-full mx-auto max-w-5xl">
          {/* Payment Method and Billing History components have been removed */}
          {currentLease && (
            <ResidenceCard 
              property={property} 
              currentLease={currentLease} 
              onOpenManagerModal={() => setIsManagerModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Manager Contact Modal Component */}
      <ManagerContactModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        propertyId={Number(id)}
        tenantId={authUser?.cognitoInfo?.userId || ""}
      />
    </>
  );
};

export default Residence;