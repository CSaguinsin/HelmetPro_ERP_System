import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./supabase";

// Sample device data for admin users in development mode
const adminDeviceSample = {
  id: "admin-device-001",
  machine_id: "HELMETPRO-ADMIN-DEV-001",
  model: "HelmetPro X2",
  firmware_version: "2.0.1",
  hardware_version: "1.0.0",
  status: "active",
  username: "admindevice",
  location: "Admin Office",
  last_connection: new Date().toISOString(),
  registered_at: new Date().toISOString()
};

function validateFallbackToken(token: string, userClientId?: string): { valid: boolean, userId?: string } {
  try {
    const tokenData = JSON.parse(atob(token));
    
    // Basic validation: Check required fields and expiration
    const isValid = tokenData.user_id && 
                   tokenData.user_client_id && 
                   tokenData.email && 
                   tokenData.timestamp && 
                   tokenData.sig &&
                   (Date.now() - tokenData.timestamp < 7 * 24 * 60 * 60 * 1000);
    
    // Additional validation against provided user_client_id if available
    if (isValid && userClientId && tokenData.user_client_id !== userClientId) {
      return { valid: false };
    }
                   
    return { 
      valid: isValid,
      userId: isValid ? tokenData.user_id : undefined 
    };
  } catch (e) {
    console.error("Failed to validate fallback token:", e);
    return { valid: false };
  }
}

/**
 * Middleware helper for hardware API authentication
 * Verifies access token and attaches device info to the request
 */
export async function verifyHardwareAuth(req: NextRequest) {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  // Try JWT token first (Bearer auth)
  const authHeader = req.headers.get("Authorization");
  const accessToken = req.headers.get("access_token");
  const userClientId = req.headers.get("x-user-client-id");
  
  console.log("Auth verification called for:", req.nextUrl.pathname);
  console.log("Auth headers:", { 
    authHeader: authHeader ? "present" : "missing", 
    accessToken: accessToken ? "present" : "missing",
    userClientId: userClientId ? "present" : "missing"
  });
  
  let token = "";
  let isJwtToken = false;
  
  // Extract token from Authorization header or access_token
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    isJwtToken = true;
  } else if (accessToken) {
    token = accessToken;
    isJwtToken = token.includes('.');
  }
  
  if (!token) {
    console.log("Auth failed: No token found");
    return {
      authenticated: false,
      response: NextResponse.json({ error: "Unauthorized: Access token required" }, { status: 401 }),
      device: null,
      user: null
    };
  }
  
  console.log("Token type:", isJwtToken ? "JWT" : "Fallback");
  
  try {
    if (isJwtToken) {
      // Handle JWT token (from Supabase)
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return {
          authenticated: false,
          response: NextResponse.json({ error: "Unauthorized: Invalid access token" }, { status: 401 }),
          device: null,
          user: null
        };
      }
      
      // Check if it's a device token or user token
      const deviceIdMatch = user.email?.match(/^device_(\d+)@helmetpro\.internal$/);
      
      if (deviceIdMatch) {
        // It's a device token
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
            device: null,
            user: null
          };
        }
        
        return {
          authenticated: true,
          response: null,
          device,
          user: null
        };
      } else {
        // It's a user token
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();
          
        if (userError || !userData) {
          return {
            authenticated: false,
            response: NextResponse.json({ error: "Unauthorized: User not found" }, { status: 401 }),
            device: null,
            user: null
          };
        }
        
        // For hardware endpoints, also fetch the user's associated device if needed
        const isDeviceEndpoint = req.nextUrl.pathname.includes('/device-');
        if (isDeviceEndpoint) {
          // Check for device_id parameter in the request
          const url = new URL(req.url);
          const requestedDeviceId = url.searchParams.get('device_id');
          
          // First try to find devices associated with this user via user_client relationship
          const { data: userClient, error: userClientError } = await supabase
            .from("user_clients")
            .select("user_client_id")
            .eq("erp_user_id", userData.erp_user_id)
            .single();

          if (!userClientError && userClient) {
            // Look up device in device_list table
            let query = supabase
              .from("device_list")
              .select("*");
              
            if (requestedDeviceId) {
              query = query.eq("device_id", requestedDeviceId);
            } else {
              query = query.eq("user_client_id", userClient.user_client_id);
            }
            
            const { data: device, error: deviceError } = await query.single();
              
            if (!deviceError && device) {
              // Convert to expected device format
              const formattedDevice = {
                id: device.device_id.toString(),
                machine_id: device.device_reg_id || "unknown",
                model: device.device_type || "HelmetPro Standard",
                firmware_version: "1.0.0",
                hardware_version: "1.0.0",
                status: device.device_status.toLowerCase(),
                location: null,
                last_connection: device.updated_at,
                registered_at: device.created_at
              };
              
              return {
                authenticated: true,
                response: null,
                device: formattedDevice,
                user: userData
              };
            }
          }
          
          // Fallback - check local storage for device ID if stored
          const localDeviceInfo = req.headers.get("x-device-info");
          if (localDeviceInfo) {
            try {
              const deviceInfo = JSON.parse(localDeviceInfo);
              if (deviceInfo.device_id) {
                const { data: device, error: deviceError } = await supabase
                  .from("device_list")
                  .select("*")
                  .eq("device_id", deviceInfo.device_id)
                  .single();
                
                if (!deviceError && device) {
                  // Convert to expected device format
                  const formattedDevice = {
                    id: device.device_id.toString(),
                    machine_id: device.device_reg_id || "unknown",
                    model: device.device_type || "HelmetPro Standard",
                    firmware_version: "1.0.0",
                    hardware_version: "1.0.0",
                    status: device.device_status.toLowerCase(),
                    location: null,
                    last_connection: device.updated_at,
                    registered_at: device.created_at
                  };
                  
                  return {
                    authenticated: true,
                    response: null,
                    device: formattedDevice,
                    user: userData
                  };
                }
              }
            } catch (e) {
              console.error("Failed to parse device info:", e);
            }
          }
        }
        
        // Special case for admins in development mode
        if (false && isDev && userData.email === 'admin@helmetprosolutions.com') {
          console.log("Using simulated device for admin user in development mode");
          return {
            authenticated: true,
            response: null,
            device: adminDeviceSample,
            user: userData
          };
        }
        
        return {
          authenticated: true,
          response: null,
          device: null,
          user: userData
        };
      }
    } else {
      // Handle fallback token
      const validation = validateFallbackToken(token, userClientId?.toString());
      
      if (!validation.valid) {
        return {
          authenticated: false,
          response: NextResponse.json({ error: "Unauthorized: Invalid token format" }, { status: 401 }),
          device: null,
          user: null
        };
      }
      
      // Get user by ID
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("erp_user_id", validation.userId)
        .single();
        
      if (userError || !userData) {
        return {
          authenticated: false,
          response: NextResponse.json({ error: "Unauthorized: User not found" }, { status: 401 }),
          device: null,
          user: null
        };
      }
      
      // For hardware endpoints, also fetch the user's associated device if needed
      const isDeviceEndpoint = req.nextUrl.pathname.includes('/device-');
      if (isDeviceEndpoint) {
        // Check for device_id parameter in the request
        const url = new URL(req.url);
        const requestedDeviceId = url.searchParams.get('device_id');
        
        // First try to find devices associated with this user via user_client relationship
        const { data: userClient, error: userClientError } = await supabase
          .from("user_clients")
          .select("user_client_id")
          .eq("erp_user_id", validation.userId)
          .single();

        if (!userClientError && userClient) {
          // Look up device in device_list table
          let query = supabase
            .from("device_list")
            .select("*");
            
          if (requestedDeviceId) {
            query = query.eq("device_id", requestedDeviceId);
          } else {
            query = query.eq("user_client_id", userClient.user_client_id);
          }
          
          const { data: device, error: deviceError } = await query.single();
            
          if (!deviceError && device) {
            // Convert to expected device format
            const formattedDevice = {
              id: device.device_id.toString(),
              machine_id: device.device_reg_id || "unknown",
              model: device.device_type || "HelmetPro Standard", 
              firmware_version: "1.0.0",
              hardware_version: "1.0.0",
              status: device.device_status.toLowerCase(),
              location: null,
              last_connection: device.updated_at,
              registered_at: device.created_at
            };
            
            return {
              authenticated: true,
              response: null,
              device: formattedDevice,
              user: userData
            };
          }
        }
        
        // Fallback - check local storage for device ID if stored
        const localDeviceInfo = req.headers.get("x-device-info");
        if (localDeviceInfo) {
          try {
            const deviceInfo = JSON.parse(localDeviceInfo);
            if (deviceInfo.device_id) {
              const { data: device, error: deviceError } = await supabase
                .from("device_list")
                .select("*")
                .eq("device_id", deviceInfo.device_id)
                .single();
              
              if (!deviceError && device) {
                // Convert to expected device format
                const formattedDevice = {
                  id: device.device_id.toString(),
                  machine_id: device.device_reg_id || "unknown",
                  model: device.device_type || "HelmetPro Standard",
                  firmware_version: "1.0.0",
                  hardware_version: "1.0.0",
                  status: device.device_status.toLowerCase(),
                  location: null,
                  last_connection: device.updated_at,
                  registered_at: device.created_at
                };
                
                return {
                  authenticated: true,
                  response: null,
                  device: formattedDevice,
                  user: userData
                };
              }
            }
          } catch (e) {
            console.error("Failed to parse device info:", e);
          }
        }
      }
      
      // Special case for admins in development mode with fallback tokens
      if (false && isDev && userData.email === 'admin@helmetprosolutions.com') {
        console.log("Using simulated device for admin user in development mode (fallback token)");
        return {
          authenticated: true,
          response: null,
          device: adminDeviceSample,
          user: userData
        };
      }
      
      return {
        authenticated: true,
        response: null,
        device: null,
        user: userData
      };
    }
  } catch (err) {
    console.error("Auth error:", err);
    return {
      authenticated: false,
      response: NextResponse.json({ error: "Internal server error" }, { status: 500 }),
      device: null,
      user: null
    };
  }
} 