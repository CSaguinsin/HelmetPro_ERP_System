import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./supabase";

/**
 * Middleware helper for hardware API authentication
 * Verifies access token and attaches device info to the request
 */
export async function verifyHardwareAuth(req: NextRequest) {
  // Get authorization header
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: "Unauthorized: Access token required" }, { status: 401 }),
      device: null
    };
  }

  // Extract token
  const token = authHeader.split(" ")[1];
  
  try {
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return {
        authenticated: false,
        response: NextResponse.json({ error: "Unauthorized: Invalid access token" }, { status: 401 }),
        device: null
      };
    }
    
    // Extract device ID from user email (device_ID@helmetpro.internal)
    const deviceIdMatch = user.email?.match(/^device_(\d+)@helmetpro\.internal$/);
    if (!deviceIdMatch) {
      return {
        authenticated: false,
        response: NextResponse.json({ error: "Unauthorized: Not a valid device token" }, { status: 401 }),
        device: null
      };
    }
    
    const deviceId = deviceIdMatch[1];
    
    // Get device info
    const { data: device, error: deviceError } = await supabase
      .from("devices")
      .select("*")
      .eq("id", deviceId)
      .single();
      
    if (deviceError || !device) {
      return {
        authenticated: false,
        response: NextResponse.json({ error: "Unauthorized: Device not found" }, { status: 401 }),
        device: null
      };
    }
    
    return {
      authenticated: true,
      response: null,
      device
    };
  } catch (err) {
    console.error("Auth error:", err);
    return {
      authenticated: false,
      response: NextResponse.json({ error: "Internal server error" }, { status: 500 }),
      device: null
    };
  }
} 