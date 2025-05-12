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
    // Get data from request
    const data = await req.json();
    const { deviceId, fileType, fileUrl, createdAt } = data;
    
    console.log("Media insert request received:", { deviceId, fileType, fileUrl });
    
    if (!deviceId || !fileType || !fileUrl) {
      return NextResponse.json({ 
        error: "Missing required fields (deviceId, fileType, fileUrl)" 
      }, { status: 400 });
    }
    
    // Insert the record using the admin client
    const { data: mediaRecord, error } = await supabaseAdmin
      .from("media_files")
      .insert({
        device_id: deviceId,
        file_type: fileType,
        file_url: fileUrl,
        created_at: createdAt || new Date().toISOString(),
        optimization_status: null,
        thumbnail_urls: null,
        display_order: null
      })
      .select()
      .single();
    
    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json({ error: "Failed to save file reference: " + error.message }, { status: 500 });
    }
    
    console.log("Media record inserted successfully:", mediaRecord);
    
    return NextResponse.json({ 
      success: true, 
      data: mediaRecord
    }, { status: 200 });
    
  } catch (error) {
    console.error("Media insert error:", error);
    return NextResponse.json({ error: "Failed to insert media record" }, { status: 500 });
  }
} 