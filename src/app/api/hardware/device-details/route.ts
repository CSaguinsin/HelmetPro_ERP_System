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

// Sample device for testing
const sampleDevice: DeviceDetails = {
  id: "999",
  machine_id: "TEST_MACHINE_001",
  model: "HelmetPro X1",
  firmware_version: "1.2.3",
  hardware_version: "2.0.0",
  last_connection: new Date().toISOString(),
  status: "active",
  location: "Test Location",
  registered_at: new Date().toISOString()
};

/**
 * @swagger
 * /api/hardware/device-details:
 *   get:
 *     summary: Get device details
 *     description: Retrieves detailed information about the authenticated device or user's associated device
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Optional device ID to retrieve a specific device
 *       - in: query
 *         name: test_mode
 *         schema:
 *           type: boolean
 *         description: When set to true, returns sample device data for testing (development only)
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
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Check for test_mode
    const url = new URL(req.url);
    const testMode = url.searchParams.get('test_mode') === 'true';
    
    if (testMode) {
      console.log("Device details endpoint running in test mode");
      return NextResponse.json({
        device: sampleDevice
      }, { status: 200 });
    }
    
    // Regular authentication and processing
    const { authenticated, response, device } = await verifyHardwareAuth(req);
    
    if (!authenticated) {
      return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
    
    if (!device) {
      return NextResponse.json({ 
        error: "No device associated with this user. Please specify a device_id parameter or associate a device with your account." 
      }, { status: 404 });
    }
    
    return NextResponse.json({ device }, { status: 200 });
  } catch (error) {
    console.error("Error in device-details endpoint:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve device details",
      message: "An internal server error occurred. Please contact support if this issue persists."
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/hardware/device-details:
 *   post:
 *     summary: Get device details
 *     description: Alternative POST method to retrieve device information
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Optional device ID to retrieve a specific device
 *       - in: query
 *         name: test_mode
 *         schema:
 *           type: boolean
 *         description: When set to true, returns sample device data for testing (development only)
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
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Check for test_mode in body
    let testMode = false;
    let bodyContent: Record<string, unknown> = {};
    
    try {
      // Clone the request so we can read the body without consuming it
      const clonedReq = req.clone();
      bodyContent = await clonedReq.json();
      testMode = bodyContent.test_mode === true;
    } catch {
      // If we can't parse the body, assume it's not test mode
    }
    
    if (testMode) {
      console.log("Device details endpoint running in test mode (POST)");
      return NextResponse.json({
        device: sampleDevice
      }, { status: 200 });
    }
    
    // Regular authentication and processing
    const { authenticated, response, device } = await verifyHardwareAuth(req);
    
    if (!authenticated) {
      return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
    
    if (!device) {
      return NextResponse.json({ 
        error: "No device associated with this user. Please specify a device_id parameter or associate a device with your account." 
      }, { status: 404 });
    }
    
    return NextResponse.json({ device }, { status: 200 });
  } catch (error) {
    console.error("Error in device-details endpoint:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve device details",
      message: "An internal server error occurred. Please contact support if this issue persists."
    }, { status: 500 });
  }
} 