import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

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

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Get form data
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
    
    // Generate a unique filename with the correct path structure
    // Path in storage: media/[deviceId]/filename
    const storagePath = `media/${deviceId}/${file.name}`;
    
    // Database path should match the hierarchy
    const filePath = storagePath;
    
    // Use the existing bucket - don't try to create it
    const bucketName = "vending-media";
    
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
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}