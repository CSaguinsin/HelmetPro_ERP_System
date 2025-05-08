import { NextRequest, NextResponse } from "next/server";
import { verifyHardwareAuth } from "@/lib/hardware-auth";
import { supabase } from "@/lib/supabase";

// Move the enum to a separate file or define it as a regular const
// Route files should only export route handlers
const PAYMENT_METHODS = {
  COIN_SLOT: "coin_slot",
  BILL_ACCEPTOR: "bill_acceptor",
  CARD_ONLY: "card_only"
} as const;

// Define settings interface for type safety
interface DeviceSettings {
  required_payment_amount: number;
  payment_methods: string[];
  machine_id: string;
  smoke_duration: number;
  smoke_repeat_every: number;
  uv_light_duration: number;
  blower_drying_time: number;
  blower_drying_repeat_every: number;
  open_door_after: number;
  timezone: string;
}

/**
 * @swagger
 * /api/hardware/settings:
 *   get:
 *     summary: Get device settings
 *     description: Retrieves configuration settings for the device
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 settings:
 *                   type: object
 *                   properties:
 *                     required_payment_amount:
 *                       type: number
 *                     payment_methods:
 *                       type: array
 *                       items:
 *                         type: string
 *                         enum: [coin_slot, bill_acceptor, card_only]
 *                     machine_id:
 *                       type: string
 *                     smoke_duration:
 *                       type: number
 *                     smoke_repeat_every:
 *                       type: number
 *                     uv_light_duration:
 *                       type: number
 *                     blower_drying_time:
 *                       type: number
 *                     blower_drying_repeat_every:
 *                       type: number
 *                     open_door_after:
 *                       type: number
 *                     timezone:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(req: NextRequest): Promise<Response> {
  // Verify auth token
  const { authenticated, response, device } = await verifyHardwareAuth(req);
  
  if (!authenticated || !device) {
    return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  try {
    // Get device settings from database
    const { data: settings, error } = await supabase
      .from("device_settings")
      .select("*")
      .eq("device_id", device.id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to fetch device settings" }, { status: 500 });
    }

    // If no settings found, return default values
    if (!settings) {
      const defaultSettings: DeviceSettings = {
        required_payment_amount: 50, // Default amount
        payment_methods: [PAYMENT_METHODS.COIN_SLOT], // Default to coin slot
        machine_id: device.machine_id || "",
        smoke_duration: 30, // Default 30 seconds
        smoke_repeat_every: 5, // Default 5 seconds
        uv_light_duration: 30, // Default 30 seconds
        blower_drying_time: 60, // Default 60 seconds
        blower_drying_repeat_every: 10, // Default 10 seconds
        open_door_after: 120, // Default 120 seconds
        timezone: "Asia/Manila" // Default timezone
      };
      
      return NextResponse.json({
        settings: defaultSettings
      }, { status: 200 });
    }

    // Parse payment methods from DB (stored as comma-separated string or array)
    let paymentMethods;
    if (typeof settings.payment_methods === 'string') {
      paymentMethods = settings.payment_methods.split(',').map((method: string) => method.trim());
    } else if (Array.isArray(settings.payment_methods)) {
      paymentMethods = settings.payment_methods;
    } else {
      paymentMethods = [PAYMENT_METHODS.COIN_SLOT]; // Default if not set
    }

    // Return configured settings
    const deviceSettings: DeviceSettings = {
      required_payment_amount: settings.required_payment_amount,
      payment_methods: paymentMethods,
      machine_id: settings.machine_id || device.machine_id || "",
      smoke_duration: settings.smoke_duration,
      smoke_repeat_every: settings.smoke_repeat_every,
      uv_light_duration: settings.uv_light_duration,
      blower_drying_time: settings.blower_drying_time,
      blower_drying_repeat_every: settings.blower_drying_repeat_every,
      open_door_after: settings.open_door_after,
      timezone: settings.timezone || "Asia/Manila"
    };

    return NextResponse.json({
      settings: deviceSettings
    }, { status: 200 });
  } catch (err) {
    console.error("Error fetching settings:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/hardware/settings:
 *   post:
 *     summary: Get device settings
 *     description: Alternative POST method to retrieve device settings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 settings:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest): Promise<Response> {
  // Reuse GET implementation for POST method
  return GET(req);
} 