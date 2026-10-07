"use client";

import React, { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  tenantId: string;
}

export default function ComplaintModal({ isOpen, onClose, propertyId, tenantId }: ComplaintModalProps) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate successful submission instantly
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(true);
      
      setTimeout(() => {
        setSuccessMessage(false);
        setSubject('');
        setMessage('');
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 z-50"
      >
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="h-10 w-10 bg-blue-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-blue-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Send Complaint to Manager
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Your property manager will review and respond shortly.
            </p>
          </div>
        </div>

        {successMessage ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-3 font-bold text-lg">
              ✓
            </div>
            <h4 className="text-lg font-medium text-zinc-900 dark:text-white">Complaint Sent Successfully!</h4>
            <p className="text-sm text-zinc-500">The manager has been notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Category
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              >
                <option value="Maintenance">Maintenance & Repairs</option>
                <option value="Noise">Noise Disturbance</option>
                <option value="Billing">Billing & Payments</option>
                <option value="Other">Other Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Subject
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g., Leaking kitchen faucet"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Description
              </label>
              <textarea 
                required
                rows={4}
                placeholder="Please describe the issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>

            <div className="pt-3 flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-zinc-900 text-white text-center py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition flex items-center justify-center space-x-2 dark:bg-white dark:text-zinc-900 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Complaint'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-zinc-100 text-zinc-700 text-center py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}