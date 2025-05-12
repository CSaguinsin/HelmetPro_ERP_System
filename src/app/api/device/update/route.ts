import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(req: NextRequest): Promise<Response> {
  try {
    // Extract the token from the request headers
    const token = req.headers.get('access_token') || '';
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json();
    const { deviceId, media_configured } = body;
    
    if (!deviceId) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 });
    }
    
    // Get user_client_id from the token or headers
    let userClientId = '';
    try {
      if (!token.includes('.')) {
        // This might be our custom token
        const tokenData = JSON.parse(atob(token));
        userClientId = tokenData.user_client_id || '';
      }
    } catch (e) {
      console.warn("Failed to parse token", e);
    }
    
    if (!userClientId) {
      // Attempt to extract from a separate header if available
      userClientId = req.headers.get('x-user-client-id') || '';
    }
    
    // Update the device record with the new media_configured flag
    const updateData: Record<string, unknown> = {};
    if (media_configured !== undefined) {
      updateData.media_configured = media_configured;
    }
    
    // Only update if we have something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }
    
    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    // Update the device in the database
    const { data, error } = await supabase
      .from("device_list")
      .update(updateData)
      .eq("device_id", deviceId)
      .select();
    
    if (error) {
      console.error("Error updating device:", error);
      return NextResponse.json({ error: "Failed to update device" }, { status: 500 });
    }
    
    // Return success response with updated device data
    return NextResponse.json({ 
      success: true,
      device: data && data.length > 0 ? data[0] : null
    });
    
  } catch (error) {
    console.error("Error in device update API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 