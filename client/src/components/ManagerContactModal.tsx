import React, { useState } from 'react';
import { User, Phone, Mail, Clock, X, AlertCircle } from 'lucide-react';
import ComplaintModal from './ComplaintModal';

interface Manager {
  name: string;
  role: string;
  phone: string;
  email: string;
  officeHours: string;
}

interface ManagerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  manager?: Manager;
  propertyId?: number;
  tenantId?: string;
}

export default function ManagerContactModal({ isOpen, onClose, manager, propertyId, tenantId }: ManagerContactModalProps) {
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  if (!isOpen) return null;

  const managerDetails = manager || {
    name: 'Sarah Jenkins',
    role: 'Property Manager',
    phone: '+233 24 123 4567',
    email: 'sarah.jenkins@unistay.com',
    officeHours: 'Mon - Fri: 8:00 AM - 5:00 PM',
  };

  return (
    <>
      <div 
        onClick={onClose} 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 z-50"
        >
          
          {/* Close Button */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-50 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
              <User className="h-8 w-8 text-zinc-600 dark:text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              {managerDetails.name}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {managerDetails.role}
            </p>
          </div>

          {/* Contact Details List */}
          <div className="py-4 space-y-4">
            <div className="flex items-center space-x-3 text-zinc-700 dark:text-zinc-300">
              <Phone className="h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-400">Phone Number</p>
                <a href={`tel:${managerDetails.phone}`} className="font-medium hover:underline">
                  {managerDetails.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-zinc-700 dark:text-zinc-300">
              <Mail className="h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-400">Email Address</p>
                <a href={`mailto:${managerDetails.email}`} className="font-medium hover:underline">
                  {managerDetails.email}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-zinc-700 dark:text-zinc-300">
              <Clock className="h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-400">Office Hours</p>
                <p className="font-medium text-sm">{managerDetails.officeHours}</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex space-x-3">
              <a 
                href={`tel:${managerDetails.phone}`}
                className="flex-1 bg-zinc-900 text-white text-center py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition dark:bg-white dark:text-zinc-900 text-sm flex items-center justify-center"
              >
                Call Manager
              </a>
              <button 
                type="button"
                onClick={() => setIsComplaintModalOpen(true)}
                className="flex-1 bg-amber-50 text-amber-700 border border-amber-200 text-center py-2.5 rounded-lg font-medium hover:bg-amber-100 transition text-sm flex items-center justify-center space-x-1 cursor-pointer"
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>File Complaint</span>
              </button>
            </div>
            
            <button 
              type="button"
              onClick={onClose}
              className="w-full bg-zinc-100 text-zinc-700 text-center py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer text-sm"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Complaint Form Modal Pop-up */}
      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        propertyId={propertyId || 1}
        tenantId={tenantId || ""}
      />
    </>
  );
}