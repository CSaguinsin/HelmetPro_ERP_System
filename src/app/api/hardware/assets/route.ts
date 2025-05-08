import { NextRequest, NextResponse } from "next/server";
import { verifyHardwareAuth } from "@/lib/hardware-auth";
import { supabase } from "@/lib/supabase";

/**
 * @swagger
 * /api/hardware/assets:
 *   get:
 *     summary: Get device assets
 *     description: Retrieves URLs for images and ads to be displayed on the device
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
 *                 assets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [banner, icon, video]
 *                       url:
 *                         type: string
 *                       name:
 *                         type: string
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

  try {
    // Get assigned asset groups for this device
    const { data: assetGroups, error: groupError } = await supabase
      .from("device_asset_groups")
      .select("asset_group_id")
      .eq("device_id", device.id);

    if (groupError) {
      return NextResponse.json({ error: "Failed to fetch asset groups" }, { status: 500 });
    }

    // Extract group IDs
    const groupIds = assetGroups?.map(group => group.asset_group_id) || [];

    // If no groups assigned, return empty list
    if (groupIds.length === 0) {
      return NextResponse.json({ assets: [] }, { status: 200 });
    }

    // Get assets from these groups
    const { data: assets, error: assetError } = await supabase
      .from("assets")
      .select("id, name, type, file_path, created_at")
      .in("group_id", groupIds)
      .order("created_at", { ascending: false });

    if (assetError) {
      return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
    }

    // Generate signed URLs for each asset
    const assetsWithUrls = await Promise.all(
      (assets || []).map(async (asset) => {
        const { data: urlData } = await supabase.storage
          .from("assets")
          .createSignedUrl(asset.file_path, 60 * 60 * 24); // 24 hour expiry

        return {
          id: asset.id,
          type: asset.type,
          name: asset.name,
          url: urlData?.signedUrl || "",
        };
      })
    );

    return NextResponse.json({ assets: assetsWithUrls }, { status: 200 });
  } catch (err) {
    console.error("Error fetching assets:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/hardware/assets:
 *   post:
 *     summary: Get device assets
 *     description: Alternative POST method to retrieve asset URLs
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
 *                 assets:
 *                   type: array
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest): Promise<Response> {
  // Reuse GET implementation for POST method
  return GET(req);
} 