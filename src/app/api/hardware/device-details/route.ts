import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET handler to fetch device details
export async function GET(request: Request): Promise<Response> {
  console.log("Device details endpoint called with GET");
  
  try {
    // Extract the token from the request headers
    const token = request.headers.get('access_token') || '';
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Try to extract user_client_id from token if it's our custom token
    let userClientId = '';
    try {
      if (!token.includes('.')) {
        // This might be our custom token
        const tokenData = JSON.parse(atob(token));
        userClientId = tokenData.user_client_id || '';
      } else {
        // It's likely a JWT, we should validate it with Supabase auth
        const parsedUrl = new URL(request.url);
        userClientId = parsedUrl.searchParams.get('user_client_id') || '';
      }
    } catch (e) {
      console.warn("Failed to parse token", e);
    }
    
    if (!userClientId) {
      // Attempt to extract from a separate header if available
      userClientId = request.headers.get('x-user-client-id') || '';
    }
    
    if (!userClientId) {
      return NextResponse.json({ error: "User client ID not provided" }, { status: 400 });
    }
    
    // Query Supabase for device data
    const { data, error } = await supabase
      .from("device_list")
      .select("*")
      .eq("user_client_id", userClientId)
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No device found
        return NextResponse.json({ error: "No device associated with this user" }, { status: 404 });
      }
      throw error;
    }
    
    if (!data) {
      return NextResponse.json({ error: "No device found" }, { status: 404 });
    }
    
    // Map database fields to the expected API response
    const device = {
      id: data.device_id.toString(),
      machine_id: data.device_reg_id || "UNKNOWN_ID",
      model: data.device_type || "HelmetPro Standard",
      firmware_version: "1.0.0",
      hardware_version: "1.0.0",
      last_connection: new Date().toISOString(),
      status: data.device_status === "Enable" ? "active" : "inactive",
      location: "Not specified",
      registered_at: data.created_at || new Date().toISOString()
    };
    
    return NextResponse.json({ device }, { status: 200 });
  } catch (error) {
    console.error("Error fetching device details:", error);
    return NextResponse.json({ 
      error: "Failed to fetch device details"
    }, { status: 500 });
  }
}

// POST implementation for completeness
export async function POST(request: Request): Promise<Response> {
  // Implementation similar to GET but for POST requests
  return GET(request);
} 