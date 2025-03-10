"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import MediaUploadComponent from "./MediaUploadComponent"
import { Button } from "@/components/ui/button"

export default function MachineImagesPage() {
  const params = useParams()
  const urlDeviceId = params.deviceId as string
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        setLoading(true);
        
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error("User not authenticated");
        }

        // Get user_client_id from user_clients table
        const { data: userClientData, error: userClientError } = await supabase
          .from("user_clients")
          .select("user_client_id")
          .eq("erp_user_id", user.id)
          .single();

        if (userClientError || !userClientData) {
          throw new Error("User client information not found");
        }

        // Verify device belongs to the user
        const { data: deviceData, error: deviceError } = await supabase
          .from("device_list")
          .select("device_id")
          .eq("device_id", urlDeviceId)
          .eq("user_client_id", userClientData.user_client_id)
          .single();

        if (deviceError || !deviceData) {
          throw new Error("Device not found or not linked to the user");
        }

        setDeviceId(deviceData.device_id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceInfo();
  }, [urlDeviceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">{error}</p>
          <Button 
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!deviceId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-4">No Device Found</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            No device found for the authenticated user.
          </p>
          <Button 
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <MediaUploadComponent deviceId={deviceId} />
    </div>
  );
}