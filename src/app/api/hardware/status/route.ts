import { NextRequest, NextResponse } from "next/server";
import { verifyHardwareAuth } from "@/lib/hardware-auth";
import { supabase } from "@/lib/supabase";

// Define types for better type safety
interface DeviceStatus {
  code: number;
  description: string;
  last_updated: string;
}

interface StatusHistoryItem {
  id: string;
  device_id: string;
  machine_id: string;
  status_code: number;
  status_description: string;
  timestamp: string;
}

/**
 * @swagger
 * /api/hardware/status:
 *   post:
 *     summary: Update device status
 *     description: Sends current machine status information
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - description
 *             properties:
 *               code:
 *                 type: number
 *                 description: Status code identifying the machine state
 *               description:
 *                 type: string
 *                 description: Human-readable status description
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest): Promise<Response> {
  // Verify auth token
  const { authenticated, response, device } = await verifyHardwareAuth(req);
  
  if (!authenticated || !device) {
    return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  try {
    // Parse request body
    const { code, description } = await req.json();

    // Validate required fields
    if (code === undefined || !description) {
      return NextResponse.json({ 
        error: "Status code and description are required" 
      }, { status: 400 });
    }

    // Record status update
    const { error } = await supabase
      .from("device_status_history")
      .insert({
        device_id: device.id,
        machine_id: device.machine_id,
        status_code: code,
        status_description: description,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to record status update" }, { status: 500 });
    }

    // Update current device status
    const { error: updateError } = await supabase
      .from("devices")
      .update({ 
        status_code: code,
        status_description: description,
        last_status_update: new Date().toISOString()
      })
      .eq("id", device.id);

    if (updateError) {
      console.error("Status update error:", updateError);
      // Continue despite error, as we've already recorded the status history
    }

    // Check if this is an error status code (assuming codes >= 400 are errors)
    if (code >= 400) {
      // Create notification for admin/staff
      await supabase
        .from("notifications")
        .insert({
          type: "device_error",
          title: `Machine Error: ${device.machine_id}`,
          message: `Error (${code}): ${description}`,
          device_id: device.id,
          is_read: false,
          created_at: new Date().toISOString()
        });
    }

    return NextResponse.json({ 
      message: "Status updated successfully" 
    }, { status: 200 });
  } catch (err) {
    console.error("Error updating status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/hardware/status:
 *   get:
 *     summary: Get device status history
 *     description: Retrieves status history for the authenticated device
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
 *                 current_status:
 *                   type: object
 *                 status_history:
 *                   type: array
 *                   items:
 *                     type: object
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
    // Get recent status history for this device
    const { data: statusHistory, error } = await supabase
      .from("device_status_history")
      .select("*")
      .eq("device_id", device.id)
      .order("timestamp", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch status history" }, { status: 500 });
    }

    // Get current status from device record
    const currentStatus: DeviceStatus = {
      code: device.status_code,
      description: device.status_description,
      last_updated: device.last_status_update
    };

    return NextResponse.json({ 
      current_status: currentStatus,
      status_history: statusHistory as StatusHistoryItem[] || [] 
    }, { status: 200 });
  } catch (err) {
    console.error("Error fetching status history:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 