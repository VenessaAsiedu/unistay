import React from 'react';
import { User, Phone, Mail, Clock, X } from 'lucide-react';

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
}
export default function ManagerContactModal({ isOpen, onClose, manager }: ManagerContactModalProps) {

  // Fallback manager details if none provided via props
  const managerDetails = manager || {
    name: 'Sarah Jenkins',
    role: 'Property Manager',
    phone: '+233 24 123 4567',
    email: 'sarah.jenkins@unistay.com',
    officeHours: 'Mon - Fri: 8:00 AM - 5:00 PM',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
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
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex space-x-3">
          <a 
            href={`tel:${managerDetails.phone}`}
            className="flex-1 bg-zinc-900 text-white text-center py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition dark:bg-white dark:text-zinc-900"
          >
            Call Manager
          </a>
          <button 
            onClick={onClose}
            className="flex-1 bg-zinc-100 text-zinc-700 text-center py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition dark:bg-zinc-800 dark:text-zinc-300"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}