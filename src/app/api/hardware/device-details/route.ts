import { NextResponse } from "next/server";

// Sample device for testing
const sampleDevice = {
  id: "999",
  machine_id: "TEST_MACHINE_001",
  model: "HelmetPro X1",
  firmware_version: "1.2.3",
  hardware_version: "2.0.0",
  last_connection: new Date().toISOString(),
  status: "active",
  location: "Test Location",
  registered_at: new Date().toISOString()
};

// Simplified implementation to always return a success response
export async function GET(): Promise<Response> {
  console.log("Device details endpoint called with GET");
  
  // Always return success with sample data
  return NextResponse.json({
    device: sampleDevice
  }, { status: 200 });
}

// POST implementation for completeness
export async function POST(): Promise<Response> {
  console.log("Device details endpoint called with POST");
  
  // Always return success with sample data
  return NextResponse.json({
    device: sampleDevice
  }, { status: 200 });
} 