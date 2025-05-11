"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingDots } from "../../../../components/loading-dots"
import MediaUploadComponent from "./MediaUploadComponent"

export default function MachineImagesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        setLoading(true);
        const token = typeof window !== "undefined" ? localStorage.getItem('auth_token') || '' : '';
        if (!token) {
          throw new Error("User not authenticated");
        }

        // Use the hardware API to get device details
        const response = await fetch('/api/hardware/device-details', {
          method: 'GET',
          headers: { 'access_token': token },
        });

        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }

        if (result.device) {
          setDeviceId(result.device.device_id);
        } else {
          throw new Error("No device found");
        }
      } catch (error) {
        console.error('Error fetching device details:', error);
        setError(error instanceof Error ? error.message : "Failed to load device details");
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingDots />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  if (!deviceId) {
  return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-gray-500 mb-4">No device found</div>
        <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
    </div>
  );
  }

  return <MediaUploadComponent deviceId={deviceId} />;
}