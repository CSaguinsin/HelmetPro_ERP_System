import { NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for authentication
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Define token data type
interface TokenData {
  user_id: string;
  user_client_id: string;
  email: string;
  timestamp: number;
}

// Helper function to parse a fallback token
function parseFallbackToken(token: string): { valid: boolean, user: TokenData | null } {
  try {
    const tokenData = JSON.parse(atob(token)) as TokenData;
    
    // Basic validation: Check required fields and expiration
    if (tokenData.user_id && 
        tokenData.user_client_id && 
        tokenData.email && 
        tokenData.timestamp &&
        (Date.now() - tokenData.timestamp < 7 * 24 * 60 * 60 * 1000)) {
      // Return the token data as user
      return {
        valid: true,
        user: tokenData
      };
    }
    
    return { valid: false, user: null };
  } catch (e) {
    console.error("Failed to parse fallback token:", e);
    return { valid: false, user: null };
  }
}

/**
 * Verify user authentication and return user data if authenticated
 */
export async function verifyAuth(req: NextRequest) {
  // Try JWT token first (Bearer auth)
  const authHeader = req.headers.get("Authorization");
  const accessToken = req.headers.get("access_token");
  
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
      user: null
    };
  }
  
  try {
    if (isJwtToken) {
      // Verify the JWT token with Supabase Auth
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        console.error("Auth error:", error);
        return {
          authenticated: false,
          user: null
        };
      }
      
      // User is authenticated
      return {
        authenticated: true,
        user
      };
    } else {
      // Try to parse as fallback token
      const { valid, user } = parseFallbackToken(token);
      
      if (!valid) {
        return {
          authenticated: false,
          user: null
        };
      }
      
      return {
        authenticated: true,
        user
      };
    }
  } catch (err) {
    console.error("Auth verification error:", err);
    return {
      authenticated: false,
      user: null
    };
  }
} 