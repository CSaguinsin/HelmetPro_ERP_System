import { NextRequest, NextResponse } from "next/server";
import { verifyHardwareAuth } from "@/lib/hardware-auth";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Sample assets data for testing
const sampleAssets = [
  {
    id: "1",
    type: "banner",
    name: "Welcome Banner",
    url: "https://example.com/assets/banner1.jpg",
  },
  {
    id: "2",
    type: "video",
    name: "How to Use Device",
    url: "https://example.com/assets/tutorial.mp4",
  },
  {
    id: "3",
    type: "icon",
    name: "Settings Icon",
    url: "https://example.com/assets/settings.png",
  }
];

/**
 * @swagger
 * /api/hardware/assets:
 *   get:
 *     summary: Get device assets
 *     description: Retrieves URLs for images and ads to be displayed on the device
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: test_mode
 *         schema:
 *           type: boolean
 *         description: When set to true, returns sample asset data for testing (development only)
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
  // Check for test mode
  const isTestMode = req.nextUrl.searchParams.get("test_mode") === "true";
  
  if (isTestMode) {
    console.log("Running assets endpoint in test mode");
    return NextResponse.json({ assets: sampleAssets }, { status: 200 });
  }
  
  // Verify auth token
  const { authenticated, response, device, user } = await verifyHardwareAuth(req);
  
  if (!authenticated) {
    // Ensure response is never null by providing a default
    return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  try {
    // Try to get device ID from headers or query parameter
    const deviceInfoHeader = req.headers.get('x-device-info');
    let deviceId = null;
    
    // Parse device info from header if available
    if (deviceInfoHeader) {
      try {
        const deviceInfo = JSON.parse(deviceInfoHeader);
        deviceId = deviceInfo.device_id;
      } catch (e) {
        console.warn("Failed to parse device info header", e);
      }
    }
    
    // Use query parameter as fallback
    if (!deviceId) {
      deviceId = req.nextUrl.searchParams.get("deviceId");
    }
    
    // If we have a specific device ID from headers or query params, use it
    if (deviceId) {
      console.log(`Using device ID from request: ${deviceId}`);
      
      // Get media files for this device from our media_files table
      const { data: mediaFiles, error: mediaError } = await supabase
        .from("media_files")
        .select("media_id, file_url, file_type, created_at, display_order, thumbnail_urls")
        .eq("device_id", deviceId);
      
      if (mediaError) {
        console.error("Error fetching media files:", mediaError);
        return NextResponse.json({ error: "Failed to fetch media files" }, { status: 500 });
      }
      
      // Map to the expected format
      const formattedFiles = (mediaFiles || []).map(file => ({
        id: file.media_id,
        file_type: file.file_type,
        file_name: file.file_url.split('/').pop() || 'unknown',
        file_url: file.file_url.startsWith('http') 
          ? file.file_url 
          : supabase.storage.from("vending-media").getPublicUrl(file.file_url).data.publicUrl
      }));
      
      return NextResponse.json({ data: formattedFiles }, { status: 200 });
    }
    
    // If we have a device from the auth verification, use that
    if (device) {
      // Check if it's a simulated device in development mode
      if (device.id === "admin-device-001") {
        console.log("Using sample assets for simulated admin device");
        return NextResponse.json({ assets: sampleAssets }, { status: 200 });
      }
      
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
    }
    
    // If we have a user but no device, check if they have a device_id
    if (user && user.device_id) {
      // Get assigned asset groups for user's device
      const { data: assetGroups, error: groupError } = await supabase
        .from("device_asset_groups")
        .select("asset_group_id")
        .eq("device_id", user.device_id);

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
    }
    
    // If authenticated but no device associated
    return NextResponse.json({ 
      error: "No device associated with this user. Please associate a device with your account." 
    }, { status: 404 });
  } catch (err) {
    console.error("Error fetching assets:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/hardware/assets:
 *   post:
 *     summary: Get device assets or upload new asset
 *     description: Either retrieves asset URLs (without file upload) or uploads a new asset (with file upload)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: test_mode
 *         schema:
 *           type: boolean
 *         description: When set to true, returns sample asset data for testing (development only)
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (required for upload mode)
 *               name:
 *                 type: string
 *                 description: Display name for the asset (required for upload mode)
 *               type:
 *                 type: string
 *                 enum: [banner, icon, video, image]
 *                 description: Type of asset (required for upload mode)
 *     responses:
 *       200:
 *         description: Success - either returns assets list or upload confirmation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assets:
 *                   type: array
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     url:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest): Promise<Response> {
  // If it's a file upload, handle it
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    return handleFileUpload(req);
  }
  
  // Otherwise, handle it like a GET request
  return GET(req);
}

async function handleFileUpload(req: NextRequest): Promise<Response> {
  try {
    // First verify authentication
    const { authenticated, response, user } = await verifyHardwareAuth(req);
    
    if (!authenticated || !user) {
      return response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const deviceId = formData.get("deviceId") as string;
    
    if (!file || !type || !deviceId) {
      return NextResponse.json({ 
        error: "Missing required fields (file, type, deviceId)" 
      }, { status: 400 });
    }
    
    // Validate file type
    if (!["logo", "video", "image"].includes(type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Must be one of: logo, video, image" 
      }, { status: 400 });
    }
    
    // Check if the device belongs to the user
    const { data: deviceData, error: deviceError } = await supabase
      .from("device_list")
      .select("device_id")
      .eq("device_id", deviceId)
      .eq("user_client_id", user.user_client_id)
      .single();
    
    if (deviceError || !deviceData) {
      return NextResponse.json({ 
        error: "You don't have permission to upload files for this device" 
      }, { status: 403 });
    }
    
    // Generate a unique filename with the correct path structure
    // Path in storage: media/[deviceId]/filename
    const storagePath = `media/${deviceId}/${file.name}`;
    
    // Database path should match the hierarchy
    const filePath = storagePath;
    
    // Use the existing bucket - don't try to create it
    const bucketName = "vending-media";
    
    try {
      // Create a service role client that bypasses RLS
      // This is implemented within the API route, not exposing admin credentials to the client
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE || '',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
      
      // Upload file to Supabase Storage using admin client
      const { error: uploadError } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: true, // Use upsert to handle overwrites gracefully
        });
      
      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return NextResponse.json({ error: "Failed to upload file - " + uploadError.message }, { status: 500 });
      }
      
      // Get the public URL for the file
      const { data: urlData } = supabaseAdmin.storage
        .from(bucketName)
        .getPublicUrl(storagePath);
      
      // Save the reference in database using admin client
      const { data: mediaRecord, error: dbError } = await supabaseAdmin
        .from("media_files")
        .insert({
          device_id: deviceId,
          file_type: type,
          file_url: filePath,
          created_at: new Date().toISOString(),
          optimization_status: null,
          thumbnail_urls: null,
          display_order: null
        })
        .select()
        .single();
      
      if (dbError) {
        console.error("Database insert error:", dbError);
        return NextResponse.json({ error: "Failed to save file reference: " + dbError.message }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        data: {
          id: mediaRecord.media_id,
          file_type: mediaRecord.file_type,
          file_name: file.name,
          file_url: urlData.publicUrl || mediaRecord.file_url
        }
      }, { status: 200 });
    } catch (uploadError) {
      console.error("File upload caught error:", uploadError);
      return NextResponse.json({ error: "Upload failed - " + (uploadError as Error).message }, { status: 500 });
    }
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
} 