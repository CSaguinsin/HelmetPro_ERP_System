'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import FirmwareManager from '@/components/admin/FirmwareManager';
import Sidebar from '../../../../components/Sidebar';

export default function FirmwareManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // Check if user is authenticated and has admin privileges
  // For simplicity, we're checking if the user has a specific email domain or property
  // You might want to replace this with a proper role check based on your user model
  const isAdmin = user?.email?.includes('@admin') || user?.email === 'admin@helmetprosolutions.com';

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="hidden lg:flex">
          <Sidebar />
        </div>
        
        <div className="flex-1 overflow-auto">
          <main className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-2">You do not have permission to access the firmware management page.</p>
                <p className="mt-1">This area is restricted to administrators only.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => router.push('/dashboard')}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Firmware Management
              </h2>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300">
              Manage firmware versions for HelmetPro devices. Upload new firmware, view existing versions, and delete outdated ones.
            </p>
            
            {/* Firmware Manager Component */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <FirmwareManager />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 