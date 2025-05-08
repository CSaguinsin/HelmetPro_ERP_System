import { NextRequest, NextResponse } from "next/server";
import { verifyHardwareAuth } from "@/lib/hardware-auth";

// Define structured types for device details
interface DeviceDetails {
  id: string;
  machine_id: string;
  model: string;
  firmware_version: string;
  hardware_version: string;
  last_connection: string | null;
  status: string;
  location: string | null;
  registered_at: string;
}

/**
 * @swagger
 * /api/hardware/device-details:
 *   get:
 *     summary: Get device details
 *     description: Retrieves detailed information about the authenticated device
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
 *                 device:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(req: NextRequest): Promise<Response> {
  // Verify auth token
  const { authenticated, response, device } = await verifyHardwareAuth(req);
  
  if (!authenticated || !device) {
    // Ensure response is never null by providing a default
    return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  // Return device details
  return NextResponse.json({
    device: {
      id: device.id,
      machine_id: device.machine_id,
      model: device.model,
      firmware_version: device.firmware_version,
      hardware_version: device.hardware_version,
      last_connection: device.last_connection,
      status: device.status,
      location: device.location,
      registered_at: device.registered_at,
    } as DeviceDetails
  }, { status: 200 });
}

/**
 * @swagger
 * /api/hardware/device-details:
 *   post:
 *     summary: Get device details
 *     description: Alternative POST method to retrieve device information
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
 *                 device:
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