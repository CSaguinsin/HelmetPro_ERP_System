import { NextRequest, NextResponse } from 'next/server';
import { verifyHardwareAuth } from '@/lib/hardware-auth';
import { supabase } from '@/lib/supabase';
import { IJwtPayload } from '../../jwt';

// Move the enum to a separate file or define it as a regular const
// Route files should only export route handlers
const PAYMENT_METHODS = {
  COIN_SLOT: 'coin_slot',
  BILL_ACCEPTOR: 'bill_acceptor',
  CARD_ONLY: 'card_only',
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

interface IHardwareAuthResult {
  authenticated: boolean;
  response?: Response;
  device: IJwtPayload;
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

  const result = await verifyHardwareAuth(req);

  if (!result) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }

  // if (!result?.authenticated) {
  //   return (
  //     NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  //   );
  // }

  // Check for deviceId query parameter - for admin UI
  // const url = new URL(req.url);
  // const deviceIdParam = url.searchParams.get('deviceId');

  // Determine which device ID to use (from query for admin UI, or from auth for device itself)

  // // If deviceId param is provided, use it instead - but only if admin role
  // if (deviceIdParam) {
  //   // Check if user is admin (would need to add an isAdmin check to verifyHardwareAuth)
  //   // For now, we'll allow overriding based on provided deviceId
  //   deviceId = parseInt(deviceIdParam, 10);

  //   if (isNaN(deviceId)) {
  //     return NextResponse.json({ error: "Invalid device ID provided" }, { status: 400 });
  //   }
  // }

  try {
    // Get device settings from database
    const { data: settings, error } = await supabase
      .from('device_settings')
      .select('*')
      .eq('device_id', result.device?.id)
      .single();

    console.log(error);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch device settings' },
        { status: 500 }
      );
    }

    // If no settings found, return default values
    if (!settings) {
      const defaultSettings: DeviceSettings = {
        required_payment_amount: 50, // Default amount
        payment_methods: [PAYMENT_METHODS.COIN_SLOT], // Default to coin slot
        machine_id: result.device?.machine_id || '',
        smoke_duration: 30, // Default 30 seconds
        smoke_repeat_every: 5, // Default 5 seconds
        uv_light_duration: 30, // Default 30 seconds
        blower_drying_time: 60, // Default 60 seconds
        blower_drying_repeat_every: 10, // Default 10 seconds
        open_door_after: 120, // Default 120 seconds
        timezone: 'Asia/Manila', // Default timezone
      };

      return NextResponse.json(
        {
          settings: defaultSettings,
        },
        { status: 200 }
      );
    }

    // Parse payment methods from DB (stored as comma-separated string or array)
    let paymentMethods;
    if (typeof settings.payment_methods === 'string') {
      paymentMethods = settings.payment_methods
        .split(',')
        .map((method: string) => method.trim());
    } else if (Array.isArray(settings.payment_methods)) {
      paymentMethods = settings.payment_methods;
    } else {
      paymentMethods = [PAYMENT_METHODS.COIN_SLOT]; // Default if not set
    }

    // Return configured settings
    const deviceSettings: DeviceSettings = {
      required_payment_amount: settings.required_payment_amount,
      payment_methods: paymentMethods,
      machine_id: settings.machine_id || result.device?.machine_id || '',
      smoke_duration: settings.smoke_duration,
      smoke_repeat_every: settings.smoke_repeat_every,
      uv_light_duration: settings.uv_light_duration,
      blower_drying_time: settings.blower_drying_time,
      blower_drying_repeat_every: settings.blower_drying_repeat_every,
      open_door_after: settings.open_door_after,
      timezone: settings.timezone || 'Asia/Manila',
    };

    return NextResponse.json(
      {
        settings: deviceSettings,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching settings:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

/**
 * @swagger
 * /api/hardware/settings:
 *   put:
 *     summary: Update device settings
 *     description: Updates configuration settings for the device
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               required_payment_amount:
 *                 type: number
 *               payment_methods:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [coin_slot, bill_acceptor, card_only]
 *               machine_id:
 *                 type: string
 *               smoke_duration:
 *                 type: number
 *               smoke_repeat_every:
 *                 type: number
 *               uv_light_duration:
 *                 type: number
 *               blower_drying_time:
 *                 type: number
 *               blower_drying_repeat_every:
 *                 type: number
 *               open_door_after:
 *                 type: number
 *               timezone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// export async function PUT(req: NextRequest): Promise<Response> {
//   // Verify auth token
//   const { authenticated, response, device } = await verifyHardwareAuth(req);

//   if (!authenticated || !device) {
//     return (
//       response || NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
//     );
//   }

//   // Check for deviceId query parameter - for admin UI
//   const url = new URL(req.url);
//   const deviceIdParam = url.searchParams.get('deviceId');

//   // Determine which device ID to use (from query for admin UI, or from auth for device itself)
//   let deviceId = device.id;

//   // If deviceId param is provided, use it instead - but only if admin role
//   if (deviceIdParam) {
//     // Check if user is admin (would need to add an isAdmin check to verifyHardwareAuth)
//     // For now, we'll allow overriding based on provided deviceId
//     deviceId = parseInt(deviceIdParam, 10);

//     if (isNaN(deviceId)) {
//       return NextResponse.json({ error: 'Invalid device ID provided' }, { status: 400 });
//     }
//   }

//   try {
//     // Parse request body
//     const body = await req.json();

//     // Validate required fields
//     if (Object.keys(body).length === 0) {
//       return NextResponse.json(
//         { error: 'No settings provided for update' },
//         { status: 400 }
//       );
//     }

//     // Validate payment methods if provided
//     if (body.payment_methods) {
//       // Ensure it's an array
//       if (!Array.isArray(body.payment_methods)) {
//         return NextResponse.json(
//           { error: 'Payment methods must be an array' },
//           { status: 400 }
//         );
//       }

//       // Ensure each method is valid
//       const validMethods = Object.values(PAYMENT_METHODS);
//       for (const method of body.payment_methods) {
//         if (!validMethods.includes(method)) {
//           return NextResponse.json(
//             {
//               error: `Invalid payment method: ${method}. Valid options are: ${validMethods.join(', ')}`,
//             },
//             { status: 400 }
//           );
//         }
//       }
//     }

//     // Check if settings already exist for this device
//     const { data: existingSettings, error: fetchError } = await supabase
//       .from('device_settings')
//       .select('id')
//       .eq('device_id', deviceId)
//       .single();

//     if (fetchError && fetchError.code !== 'PGRST116') {
//       // Not found is ok
//       return NextResponse.json(
//         { error: 'Failed to check existing settings' },
//         { status: 500 }
//       );
//     }

//     let result;
//     if (existingSettings) {
//       // Update existing settings
//       const { data, error: updateError } = await supabase
//         .from('device_settings')
//         .update({
//           ...body,
//           updated_at: new Date().toISOString(),
//         })
//         .eq('device_id', deviceId)
//         .select('*')
//         .single();

//       if (updateError) {
//         return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
//       }

//       result = data;
//     } else {
//       // Insert new settings
//       const { data, error: insertError } = await supabase
//         .from('device_settings')
//         .insert({
//           device_id: deviceId,
//           ...body,
//           updated_at: new Date().toISOString(),
//         })
//         .select('*')
//         .single();

//       if (insertError) {
//         return NextResponse.json({ error: 'Failed to create settings' }, { status: 500 });
//       }

//       result = data;
//     }

//     // Parse payment methods for consistent response
//     let paymentMethods;
//     if (typeof result.payment_methods === 'string') {
//       paymentMethods = result.payment_methods
//         .split(',')
//         .map((method: string) => method.trim());
//     } else if (Array.isArray(result.payment_methods)) {
//       paymentMethods = result.payment_methods;
//     } else {
//       paymentMethods = [PAYMENT_METHODS.COIN_SLOT];
//     }

//     // Format response
//     const deviceSettings: DeviceSettings = {
//       required_payment_amount: result.required_payment_amount,
//       payment_methods: paymentMethods,
//       machine_id: result.machine_id || device.machine_id || '',
//       smoke_duration: result.smoke_duration,
//       smoke_repeat_every: result.smoke_repeat_every,
//       uv_light_duration: result.uv_light_duration,
//       blower_drying_time: result.blower_drying_time,
//       blower_drying_repeat_every: result.blower_drying_repeat_every,
//       open_door_after: result.open_door_after,
//       timezone: result.timezone || 'Asia/Manila',
//     };

//     return NextResponse.json(
//       {
//         settings: deviceSettings,
//         message: 'Settings updated successfully',
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error('Error updating settings:', err);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
