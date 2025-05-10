"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSettings, type DeviceSettings } from "@/lib/hardwareApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DeviceSettingsPage() {
  const { deviceId } = useParams();
  const [settings, setSettings] = useState<DeviceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem('auth_token') || '' : '';
    if (!token) return;
    setLoading(true);
    getSettings()
      .then(res => {
        if ('error' in res) {
          throw new Error(res.error);
        }
        if (res.data) {
          setSettings(res.data);
        }
      })
      .catch(() => setError("Failed to load settings."))
      .finally(() => setLoading(false));
  }, [deviceId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!settings) return <div className="p-8">No settings found.</div>;

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Device Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium">{key.replace(/_/g, ' ')}</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 