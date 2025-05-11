import { NextRequest, NextResponse } from "next/server";

/**
 * This is a compatibility layer that redirects requests from /api/hardware/device-settings
 * to /api/hardware/settings to maintain compatibility with older clients
 * 
 * It also adds support for test_mode for development testing
 */

// Default test settings to return when test_mode is active
const TEST_DEVICE_SETTINGS = {
  required_payment_amount: 50,
  payment_methods: ["coin_slot", "bill_acceptor", "card_only"],
  machine_id: "TEST-MACHINE-001",
  smoke_duration: 30,
  smoke_repeat_every: 5,
  uv_light_duration: 30,
  blower_drying_time: 60,
  blower_drying_repeat_every: 10,
  open_door_after: 120,
  timezone: "Asia/Manila"
};

export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Check for test_mode
    const url = new URL(req.url);
    const testMode = url.searchParams.get('test_mode') === 'true';
    
    if (testMode) {
      console.log("Device settings endpoint running in test mode");
      return NextResponse.json({
        settings: TEST_DEVICE_SETTINGS
      }, { status: 200 });
    }
    
    // Proceed with real implementation - forward to settings endpoint
    const baseUrl = new URL(req.url).origin;
    const settingsUrl = `${baseUrl}/api/hardware/settings${req.url.slice(req.url.indexOf('?') !== -1 ? req.url.indexOf('?') : req.url.length)}`;
    
    const response = await fetch(settingsUrl, {
      method: 'GET',
      headers: req.headers
    });
    
    if (!response.ok) {
      // Handle error from the settings endpoint
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }
    
    // Return the response from the settings endpoint
    return response;
  } catch (error) {
    console.error("Error in device-settings endpoint:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve device settings",
      message: "An internal server error occurred. Please contact support if this issue persists."
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Check for test_mode in body
    let testMode = false;
    let bodyContent: Record<string, unknown> = {};
    
    try {
      // Clone the request so we can read the body without consuming it
      const clonedReq = req.clone();
      bodyContent = await clonedReq.json();
      testMode = bodyContent.test_mode === true;
    } catch {
      // If we can't parse the body, assume it's not test mode
    }
    
    if (testMode) {
      console.log("Device settings endpoint running in test mode");
      return NextResponse.json({
        settings: TEST_DEVICE_SETTINGS
      }, { status: 200 });
    }
    
    // Forward to the /api/hardware/settings endpoint
    const baseUrl = new URL(req.url).origin;
    const settingsUrl = `${baseUrl}/api/hardware/settings`;
    
    // Instead of passing req.body directly, we'll create a new request with the body content
    const bodyText = JSON.stringify(bodyContent);
    const newRequest = new Request(settingsUrl, {
      method: 'POST',
      headers: req.headers,
      body: bodyText
    });
    
    const response = await fetch(newRequest);
    
    if (!response.ok) {
      // Handle error from the settings endpoint
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }
    
    // Return the response from the settings endpoint
    return response;
  } catch (error) {
    console.error("Error in device-settings endpoint:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve device settings",
      message: "An internal server error occurred. Please contact support if this issue persists."
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<Response> {
  try {
    // Forward to the /api/hardware/settings endpoint
    const baseUrl = new URL(req.url).origin;
    const settingsUrl = `${baseUrl}/api/hardware/settings`;
    
    // Read the body content
    let bodyContent: Record<string, unknown> = {};
    try {
      const clonedReq = req.clone();
      bodyContent = await clonedReq.json();
    } catch {
      // If body can't be parsed, use empty object
    }
    
    // Create a new request with the body content
    const bodyText = JSON.stringify(bodyContent);
    const newRequest = new Request(settingsUrl, {
      method: 'PUT',
      headers: req.headers,
      body: bodyText
    });
    
    const response = await fetch(newRequest);
    
    if (!response.ok) {
      // Handle error from the settings endpoint
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }
    
    // Return the response from the settings endpoint
    return response;
  } catch (error) {
    console.error("Error in device-settings endpoint:", error);
    return NextResponse.json({ 
      error: "Failed to update device settings",
      message: "An internal server error occurred. Please contact support if this issue persists."
    }, { status: 500 });
  }
} 