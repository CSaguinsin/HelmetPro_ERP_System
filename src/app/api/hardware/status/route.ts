import { NextRequest, NextResponse } from "next/server";
import { verifyHardwareAuth } from "@/lib/hardware-auth";
import { supabase } from "@/lib/supabase";

// Define types for better type safety
interface DeviceStatus {
  code: number;
  description: string;
  last_updated: string;
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
 *               test_mode:
 *                 type: boolean
 *                 description: If true, returns test data (for development only)
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
  try {
    // Parse request body first to check for test_mode
    const body = await req.json();
    const { code, description, test_mode, device_id } = body;
    
    // Handle test mode for development
    if (test_mode === true) {
      console.log("Status endpoint running in test mode");
      return NextResponse.json({ 
        message: "Status updated successfully (TEST MODE)",
        status: {
          code,
          description,
          timestamp: new Date().toISOString()
        }
      }, { status: 200 });
    }
    
    // Check for direct device_id in body for simplified machine-to-machine communication
    if (device_id) {
      console.log(`Using direct device ID: ${device_id} from request body`);
      // Validate required fields
      if (code === undefined || !description) {
        return NextResponse.json({ 
          error: "Status code and description are required" 
        }, { status: 400 });
      }

      try {
        // Verify device exists
        const { data: deviceData, error: deviceError } = await supabase
          .from("device_list")
          .select("*")
          .eq("device_id", device_id)
          .single();

        if (deviceError || !deviceData) {
          console.error("Device not found:", deviceError);
          return NextResponse.json({ error: "Device not found" }, { status: 401 });
        }

        // Record status update
        const { error } = await supabase
          .from("device_status_history")
          .insert({
            device_id,
            machine_id: deviceData.device_reg_id || "unknown",
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
          .from("device_list")
          .update({ 
            device_status: code >= 400 ? "error" : "active",
            last_updated: new Date().toISOString()
          })
          .eq("device_id", device_id);

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
              title: `Machine Error: ${deviceData.device_reg_id || device_id}`,
              message: `Error (${code}): ${description}`,
              device_id,
              is_read: false,
              created_at: new Date().toISOString()
            });
        }

        return NextResponse.json({ 
          message: "Status updated successfully",
          success: true
        }, { status: 200 });
      } catch (dbError) {
        console.error("Database operation error:", dbError);
        return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
      }
    }
    
    // Regular auth flow using token
    // For non-test mode, verify auth token
    const { authenticated, response, device } = await verifyHardwareAuth(req);
    
    if (!authenticated || !device) {
      return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // Validate required fields
    if (code === undefined || !description) {
      return NextResponse.json({ 
        error: "Status code and description are required" 
      }, { status: 400 });
    }

    // Ensure device_id is a valid UUID
    const deviceId = device.device_id || device.id;
    if (!deviceId || deviceId === '0' || deviceId === 'undefined') {
      return NextResponse.json({ error: "Invalid device ID" }, { status: 400 });
    }

    try {
      // Record status update
      const { error } = await supabase
        .from("device_status_history")
        .insert({
          device_id: deviceId,
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
        .from("device_list")
        .update({ 
          device_status: code >= 400 ? "error" : "active",
          last_updated: new Date().toISOString()
        })
        .eq("device_id", deviceId);

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
            device_id: deviceId,
            is_read: false,
            created_at: new Date().toISOString()
          });
      }

      return NextResponse.json({ 
        message: "Status updated successfully",
        success: true
      }, { status: 200 });
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
    }
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
 *     parameters:
 *       - in: query
 *         name: test_mode
 *         schema:
 *           type: boolean
 *         description: If true, returns test data (for development only)
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
  try {
    // Check for test_mode
    const url = new URL(req.url);
    const testMode = url.searchParams.get('test_mode') === 'true';
    
    if (testMode) {
      console.log("Status endpoint running in test mode");
      // Generate test status history
      const currentTime = new Date();
      const testCurrentStatus = {
        code: 100,
        description: "Machine operating normally",
        last_updated: currentTime.toISOString()
      };
      
      const testStatusHistory = [
        {
          id: "test-status-1",
          device_id: "1",
          machine_id: "TEST-MACHINE-001",
          status_code: 100,
          status_description: "Machine operating normally",
          timestamp: currentTime.toISOString()
        },
        {
          id: "test-status-2",
          device_id: "1",
          machine_id: "TEST-MACHINE-001",
          status_code: 101,
          status_description: "Cleaning in progress",
          timestamp: new Date(currentTime.getTime() - 3600000).toISOString() // 1 hour ago
        },
        {
          id: "test-status-3",
          device_id: "1",
          machine_id: "TEST-MACHINE-001",
          status_code: 200,
          status_description: "Machine starting up",
          timestamp: new Date(currentTime.getTime() - 7200000).toISOString() // 2 hours ago
        }
      ];
      
      return NextResponse.json({ 
        current_status: testCurrentStatus,
        status_history: testStatusHistory
      }, { status: 200 });
    }
    
    // For non-test mode, verify auth token
    const { authenticated, response, device } = await verifyHardwareAuth(req);
    
    if (!authenticated || !device) {
      return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // Ensure device_id is a valid UUID
    const deviceId = device.device_id;
    if (!deviceId || deviceId === '0' || deviceId === 'undefined') {
      return NextResponse.json({ error: "Invalid device ID" }, { status: 400 });
    }

    try {
      // Get recent status history for this device
      const { data: statusHistory, error } = await supabase
        .from("device_status_history")
        .select("*")
        .eq("device_id", deviceId)
        .order("timestamp", { ascending: false })
        .limit(50);

      if (error) {
        return NextResponse.json({ error: "Failed to fetch status history" }, { status: 500 });
      }

      // Get current device status
      const currentStatus: DeviceStatus = {
        code: statusHistory && statusHistory.length > 0 ? statusHistory[0].status_code : 100,
        description: statusHistory && statusHistory.length > 0 ? statusHistory[0].status_description : "Unknown status",
        last_updated: statusHistory && statusHistory.length > 0 ? statusHistory[0].timestamp : new Date().toISOString()
      };

      return NextResponse.json({ 
        current_status: currentStatus,
        status_history: statusHistory || []
      }, { status: 200 });
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("Error fetching status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 