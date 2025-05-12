import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import { verifyAuth } from "../../../../lib/auth";

// Create a service role client that bypasses RLS
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

// Helper function to check if user is admin
interface User {
  id?: string;
  email?: string;
}

// Using any for supabaseClient to avoid complex typing issues
const isAdminUser = async (user: User, supabaseClient: any): Promise<boolean> => {
  if (!user) return false;
  
  // First check if user email contains admin domain or is a specific admin email
  if (
    user.email?.includes('@admin') || 
    user.email === 'admin@helmetprosolutions.com'
  ) {
    return true;
  }
  
  // Otherwise check role in database
  try {
    if (!user.id) return false;
    
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
      
    return !userError && userData?.role === 'admin';
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
};

/**
 * GET - Get all firmware versions
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Verify user authentication (admin access required)
    const { authenticated, user } = await verifyAuth(req);
    
    if (!authenticated || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify admin role
    const isAdmin = await isAdminUser(user, supabaseAdmin);
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    // Get query parameters for filtering
    const url = new URL(req.url);
    const deviceModel = url.searchParams.get("deviceModel");
    
    // Query firmware table
    let query = supabaseAdmin.from("firmware").select('*');
    
    if (deviceModel) {
      query = query.eq("device_model", deviceModel);
    }
    
    // Order by version (descending)
    query = query.order("release_date", { ascending: false });
    
    const { data: firmwareList, error } = await query;
    
    if (error) {
      console.error("Error fetching firmware list:", error);
      return NextResponse.json({ error: "Failed to fetch firmware list" }, { status: 500 });
    }
    
    // Return firmware list
    return NextResponse.json({ firmwareList });
  } catch (err) {
    console.error("Error in firmware list endpoint:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST - Upload a new firmware version
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Verify user authentication (admin access required)
    const { authenticated, user } = await verifyAuth(req);
    
    if (!authenticated || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify admin role
    const isAdmin = await isAdminUser(user, supabaseAdmin);
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    // Get form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const version = formData.get("version") as string; 
    const deviceModel = formData.get("deviceModel") as string;
    const releaseNotes = formData.get("releaseNotes") as string;
    const releaseDate = formData.get("releaseDate") as string;
    
    // Validate required fields
    if (!file || !version || !deviceModel) {
      return NextResponse.json({ 
        error: "Missing required fields (file, version, deviceModel)" 
      }, { status: 400 });
    }
    
    // Generate MD5 hash for the file
    const buffer = await file.arrayBuffer();
    const md5Hash = crypto.createHash('md5').update(Buffer.from(buffer)).digest('hex');
    
    // Generate a unique filename with the correct path structure
    // Format: v[version]_[deviceModel].bin (with spaces replaced by underscores)
    const safeDeviceModel = deviceModel.replace(/\s+/g, '');
    const fileName = `v${version}_${safeDeviceModel}.bin`;
    const storagePath = `firmware/${fileName}`;
    
    // Create file data with explicit content type
    const binaryData = await file.arrayBuffer();
    
    // Upload file to Supabase Storage with explicit MIME type
    const { error: uploadError } = await supabaseAdmin.storage
      .from("firmware")
      .upload(storagePath, binaryData, {
        cacheControl: "3600",
        upsert: true,
        contentType: "application/octet-stream" // Explicitly set MIME type for binary files
      });
    
    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload firmware file" }, { status: 500 });
    }
    
    // Save the firmware info in the database
    const { data: firmwareRecord, error: dbError } = await supabaseAdmin
      .from("firmware")
      .insert({
        version,
        device_model: deviceModel,
        file_path: storagePath,
        md5_hash: md5Hash,
        release_notes: releaseNotes || "",
        release_date: releaseDate || new Date().toISOString()
      })
      .select()
      .single();
    
    if (dbError) {
      console.error("Database insert error:", dbError);
      return NextResponse.json({ error: "Failed to save firmware information" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: firmwareRecord
    }, { status: 200 });
  } catch (error) {
    console.error("Firmware upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/**
 * DELETE - Remove a firmware version
 */
export async function DELETE(req: NextRequest): Promise<Response> {
  try {
    // Verify user authentication (admin access required)
    const { authenticated, user } = await verifyAuth(req);
    
    if (!authenticated || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify admin role
    const isAdmin = await isAdminUser(user, supabaseAdmin);
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    // Get firmware ID from URL
    const url = new URL(req.url);
    const firmwareId = url.searchParams.get("id");
    
    if (!firmwareId) {
      return NextResponse.json({ error: "Firmware ID is required" }, { status: 400 });
    }
    
    // Get firmware file path before deleting
    const { data: firmware, error: fetchError } = await supabaseAdmin
      .from("firmware")
      .select("file_path")
      .eq("id", firmwareId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching firmware:", fetchError);
      return NextResponse.json({ error: "Failed to find firmware" }, { status: 404 });
    }
    
    // Delete the firmware file from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from("firmware")
      .remove([firmware.file_path]);
    
    if (storageError) {
      console.error("Storage delete error:", storageError);
      // Continue with database deletion even if storage delete fails
    }
    
    // Delete the firmware record from the database
    const { error: dbError } = await supabaseAdmin
      .from("firmware")
      .delete()
      .eq("id", firmwareId);
    
    if (dbError) {
      console.error("Database delete error:", dbError);
      return NextResponse.json({ error: "Failed to delete firmware" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Firmware delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
} 