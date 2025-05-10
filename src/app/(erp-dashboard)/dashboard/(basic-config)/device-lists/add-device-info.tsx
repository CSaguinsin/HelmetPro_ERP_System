"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/lib/auth-context";

interface AddDeviceInfoProps {
  onClose: () => void;
}

export default function AddDeviceInfo({ onClose }: AddDeviceInfoProps) {
  const { user } = useAuth();
  const [deviceUUID, setDeviceUUID] = useState("");
  const [userClientId, setUserClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserClientId = async () => {
      if (!user?.id) {
        console.error("No authenticated user found.");
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("user_clients")
          .select("user_client_id")
          .eq("erp_user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user_client_id:", error);
          toast.error("Error fetching user information");
        } else if (!data) {
          console.warn("No user_client_id found for the authenticated user.");
          toast.error("User information not found");
        } else {
          setUserClientId(data.user_client_id);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserClientId();
  }, [user]);

  const generateUUID = () => {
    const newUUID = uuidv4();
    setDeviceUUID(newUUID);
    toast.success("UUID Generated!");
  };

  const saveDevice = async () => {
    if (!deviceUUID) {
      toast.error("Generate a UUID first!");
      return;
    }
    if (!userClientId) {
      toast.error("User Client ID not found!");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("device_list").insert([
        {
          device_id: deviceUUID,
          user_client_id: userClientId,
          device_name: "Generated Device",
          device_status: "Enable",
          device_type: "Smart storage locker with screen",
          status: "Offline",
          protocol_type: "MQTT",
          maturity_time: new Date().toISOString(),
          department: "Logistics",
          customer_name: "Client A",
          device_reg_id: `DEV-${Math.floor(Math.random() * 10000)}`
        }
      ]);

      if (error) {
        console.error("Error inserting device:", error);
        toast.error("Error saving device!");
      } else {
        toast.success("Device saved successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Add New Device</h3>
      <Button 
        onClick={generateUUID} 
        className="mb-4"
        disabled={loading}
      >
        Generate UUID
      </Button>
      {deviceUUID && <p className="mt-2 text-sm text-gray-700">UUID: {deviceUUID}</p>}
      <Button 
        onClick={saveDevice} 
        disabled={!deviceUUID || loading} 
        className="mt-4"
      >
        {loading ? "Saving..." : "Save Device"}
      </Button>
      <Button 
        onClick={onClose} 
        className="mt-4 bg-gray-300"
        disabled={loading}
      >
        Cancel
      </Button>
    </div>
  );
}
