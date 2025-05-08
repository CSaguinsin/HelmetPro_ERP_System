import { NextRequest, NextResponse } from "next/server";
import { verifyHardwareAuth } from "@/lib/hardware-auth";
import { supabase } from "@/lib/supabase";

// Define firmware type for better type safety
interface FirmwareInfo {
  version: string;
  bin_url: string;
  md5_hash: string;
  release_notes: string;
}

/**
 * @swagger
 * /api/hardware/firmware:
 *   get:
 *     summary: Get firmware update file
 *     description: Retrieves the latest firmware .bin file for OTA updates
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: version
 *         schema:
 *           type: string
 *         description: Current firmware version of the device
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                 bin_url:
 *                   type: string
 *                 md5_hash:
 *                   type: string
 *                 release_notes:
 *                   type: string
 *       204:
 *         description: No update available
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
    // Get current firmware version from query
    const url = new URL(req.url);
    const currentVersion = url.searchParams.get("version") || device.firmware_version;
    
    if (!currentVersion) {
      return NextResponse.json({ error: "Current firmware version is required" }, { status: 400 });
    }

    // Get the latest firmware for this device model
    const { data: firmware, error } = await supabase
      .from("firmware")
      .select("*")
      .eq("device_model", device.model)
      .gt("release_date", new Date().toISOString()) // Only future or current releases
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Failed to fetch firmware information" }, { status: 500 });
    }

    // Check if update is needed
    if (!firmware || firmware.version === currentVersion) {
      return new NextResponse(null, { status: 204 }); // No update available
    }

    // Generate signed URL for the firmware file
    const { data: urlData } = await supabase.storage
      .from("firmware")
      .createSignedUrl(firmware.file_path, 60 * 60); // 1 hour expiry

    if (!urlData?.signedUrl) {
      return NextResponse.json({ error: "Failed to generate firmware download URL" }, { status: 500 });
    }

    // Return firmware info
    return NextResponse.json({
      version: firmware.version,
      bin_url: urlData.signedUrl,
      md5_hash: firmware.md5_hash,
      release_notes: firmware.release_notes
    } as FirmwareInfo, { status: 200 });
  } catch (err) {
    console.error("Error fetching firmware:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/hardware/firmware:
 *   post:
 *     summary: Get firmware update file
 *     description: Alternative POST method to retrieve firmware updates
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               version:
 *                 type: string
 *                 description: Current firmware version
 *     responses:
 *       200:
 *         description: Success with update available
 *       204:
 *         description: No update available
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Verify auth token
    const { authenticated, response, device } = await verifyHardwareAuth(req);
    
    if (!authenticated || !device) {
      return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // Get current version from request body
    const body = await req.json();
    const currentVersion = body.version || device.firmware_version;
    
    // Create a modified request with the version as a query parameter
    const url = new URL(req.url);
    url.searchParams.set("version", currentVersion);
    const modifiedReq = new NextRequest(url, {
      headers: req.headers,
    });
    
    // Reuse GET handler
    return GET(modifiedReq);
  } catch (err) {
    console.error("Error in firmware POST endpoint:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 