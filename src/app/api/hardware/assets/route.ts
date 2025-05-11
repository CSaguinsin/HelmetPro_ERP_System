import { NextRequest, NextResponse } from "next/server";
import { verifyHardwareAuth } from "@/lib/hardware-auth";
import { supabase } from "@/lib/supabase";

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
    // If we have a device, use that for asset lookup
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
  // Check if this is a file upload request
  const contentType = req.headers.get("content-type") || "";
  
  if (contentType.includes("multipart/form-data")) {
    return handleFileUpload(req);
  }
  
  // Not a file upload, reuse GET implementation for POST method
  return GET(req);
}

async function handleFileUpload(req: NextRequest): Promise<Response> {
  // Check for test mode
  const isTestMode = req.nextUrl.searchParams.get("test_mode") === "true";
  
  if (isTestMode) {
    console.log("Running assets upload endpoint in test mode");
    return NextResponse.json({ 
      file: {
        id: "upload-1",
        name: "Test Upload",
        url: "https://example.com/assets/test-upload.jpg"
      }
    }, { status: 200 });
  }
  
  // Verify auth token
  const { authenticated, response, device, user } = await verifyHardwareAuth(req);
  
  if (!authenticated) {
    // Ensure response is never null by providing a default
    return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
  
  try {
    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    
    if (!file || !name || !type) {
      return NextResponse.json({ error: "Missing required fields: file, name, and type" }, { status: 400 });
    }
    
    // Validate file type
    const validTypes = ["banner", "icon", "video", "image"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid asset type. Must be one of: banner, icon, video, image" }, { status: 400 });
    }
    
    // Determine which device to associate the asset with
    let deviceId: string;
    
    if (device) {
      // Check if it's a simulated device in development mode
      if (device.id === "admin-device-001") {
        console.log("Using simulated response for file upload with admin device");
        return NextResponse.json({
          file: {
            id: "admin-upload-" + Date.now(),
            name: name,
            url: `https://example.com/simulated-assets/${name}`
          }
        }, { status: 200 });
      }
      
      deviceId = device.id;
    } else if (user && user.device_id) {
      deviceId = user.device_id;
    } else {
      return NextResponse.json({ 
        error: "No device associated with this user. Please associate a device with your account." 
      }, { status: 404 });
    }
    
    // Create file buffer from file
    const fileBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(fileBuffer);
    
    // Generate unique file path
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = `device_${deviceId}/${fileName}`;
    
    // Upload to Supabase storage
    const { /* data: uploadData, */ error: uploadError } = await supabase.storage
      .from("assets")
      .upload(filePath, fileData, {
        contentType: file.type,
        upsert: false
      });
    
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
    
    // Get the default asset group for the device
    const { data: assetGroup, error: groupError } = await supabase
      .from("asset_groups")
      .select("id")
      .eq("device_id", deviceId)
      .eq("is_default", true)
      .single();
    
    let groupId: string;
    
    if (groupError || !assetGroup) {
      // Create a default group if none exists
      const { data: newGroup, error: newGroupError } = await supabase
        .from("asset_groups")
        .insert({
          name: `Device ${deviceId} Default Group`,
          device_id: deviceId,
          is_default: true
        })
        .select()
        .single();
        
      if (newGroupError || !newGroup) {
        console.error("Error creating asset group:", newGroupError);
        return NextResponse.json({ error: "Failed to create asset group" }, { status: 500 });
      }
      
      groupId = newGroup.id;
    } else {
      groupId = assetGroup.id;
    }
    
    // Save asset metadata to database
    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .insert({
        name,
        type,
        file_path: filePath,
        group_id: groupId
      })
      .select()
      .single();
      
    if (assetError || !asset) {
      console.error("Error saving asset metadata:", assetError);
      return NextResponse.json({ error: "Failed to save asset metadata" }, { status: 500 });
    }
    
    // Generate signed URL for the uploaded file
    const { data: urlData } = await supabase.storage
      .from("assets")
      .createSignedUrl(filePath, 60 * 60 * 24); // 24 hour expiry
    
    return NextResponse.json({
      file: {
        id: asset.id,
        name: asset.name,
        url: urlData?.signedUrl || ""
      }
    }, { status: 200 });
    
  } catch (err) {
    console.error("Error processing file upload:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 