"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSettings, updateSettings, type DeviceSettings } from "@/lib/hardwareApi";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define form schema with validation
const settingsFormSchema = z.object({
  required_payment_amount: z.coerce.number().min(0),
  payment_methods: z.array(z.string()),
  machine_id: z.string(),
  smoke_duration: z.coerce.number().min(0),
  smoke_repeat_every: z.coerce.number().min(0),
  uv_light_duration: z.coerce.number().min(0),
  blower_drying_time: z.coerce.number().min(0),
  blower_drying_repeat_every: z.coerce.number().min(0),
  open_door_after: z.coerce.number().min(0),
  timezone: z.string(),
});

// Payment methods options
const paymentMethodOptions = [
  { id: "coin_slot", label: "Coin Slot" },
  { id: "bill_acceptor", label: "Bill Acceptor" },
  { id: "card_only", label: "Card Only" },
];

export default function DeviceSettingsPage() {
  const { deviceId } = useParams();
  const router = useRouter();
  const [settings, setSettings] = useState<DeviceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("view");

  // Initialize form
  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      required_payment_amount: 50,
      payment_methods: ["coin_slot"],
      machine_id: "",
      smoke_duration: 30,
      smoke_repeat_every: 5,
      uv_light_duration: 30,
      blower_drying_time: 60,
      blower_drying_repeat_every: 10,
      open_door_after: 120,
      timezone: "Asia/Manila",
    },
  });

  // Load settings data
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem('auth_token') || '' : '';
    if (!token) return;
    
    setLoading(true);
    // Convert deviceId to string if it's an array or undefined
    const deviceIdString = deviceId ? (Array.isArray(deviceId) ? deviceId[0] : String(deviceId)) : undefined;
    
    getSettings(deviceIdString)
      .then(res => {
        if ('error' in res) {
          throw new Error(res.error);
        }
        if (res.data) {
          setSettings(res.data);
          
          // Update form values
          form.reset({
            required_payment_amount: res.data.required_payment_amount,
            payment_methods: res.data.payment_methods,
            machine_id: res.data.machine_id,
            smoke_duration: res.data.smoke_duration,
            smoke_repeat_every: res.data.smoke_repeat_every,
            uv_light_duration: res.data.uv_light_duration,
            blower_drying_time: res.data.blower_drying_time,
            blower_drying_repeat_every: res.data.blower_drying_repeat_every,
            open_door_after: res.data.open_door_after,
            timezone: res.data.timezone,
          });
        }
      })
      .catch(err => setError(err.message || "Failed to load settings."))
      .finally(() => setLoading(false));
  }, [deviceId, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof settingsFormSchema>) => {
    setSaving(true);
    try {
      // Convert deviceId to string if it's an array or undefined
      const deviceIdString = deviceId ? (Array.isArray(deviceId) ? deviceId[0] : String(deviceId)) : undefined;
      
      const result = await updateSettings(values, deviceIdString);
      if ('error' in result) {
        throw new Error(result.error);
      }
      if (result.data) {
        setSettings(result.data);
        toast.success("Settings updated successfully");
        setActiveTab("view");
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!settings) return <div className="p-8">No settings found.</div>;

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Device Settings</span>
            <Button variant="outline" onClick={() => router.back()}>Back</Button>
          </CardTitle>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mx-6">
            <TabsTrigger value="view">View Settings</TabsTrigger>
            <TabsTrigger value="edit">Edit Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view">
            <CardContent>
              <div className="space-y-4">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="font-medium">{key.replace(/_/g, ' ')}</span>
                    <span>
                      {key === 'payment_methods' && Array.isArray(value) 
                        ? value.map(method => method.replace(/_/g, ' ')).join(', ')
                        : String(value)
                      }
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("edit")}>Edit Settings</Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="edit">
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="required_payment_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Payment Amount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="payment_methods"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Payment Methods</FormLabel>
                        </div>
                        <div className="space-y-2">
                          {paymentMethodOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="payment_methods"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...field.value, option.id]
                                            : field.value.filter(
                                                (value) => value !== option.id
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="machine_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Machine ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="smoke_duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Smoke Duration (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smoke_repeat_every"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Smoke Repeat Every (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="uv_light_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UV Light Duration (seconds)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="blower_drying_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blower/Drying Time (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="blower_drying_repeat_every"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blower/Drying Repeat Every (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="open_door_after"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open Door After (seconds)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Asia/Manila" />
                        </FormControl>
                        <FormDescription>
                          e.g. Asia/Manila, America/New_York
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => setActiveTab("view")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 