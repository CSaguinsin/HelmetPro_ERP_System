import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { user_client_id, device_id } = await req.json();

    if (!user_client_id || !device_id) {
      return NextResponse.json({ error: "User ID and Device ID are required" }, { status: 400 });
    }

    // Check if the user owns the device
    const { data, error } = await supabase
      .from("device_list")
      .select("*")
      .eq("device_id", device_id)
      .eq("user_client_id", user_client_id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    return NextResponse.json({ message: "Device authenticated", device: data }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}