import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * /api/hardware/login:
 *   post:
 *     summary: Authenticate hardware device
 *     description: Login API for hardware devices
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Fetch device from database
    const { data: device, error } = await supabase
      .from("devices")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !device) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, device.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // Generate JWT token using signIn with device credentials
    const { data: tokenData, error: tokenError } = await supabase.auth.signInWithPassword({
      email: `device_${device.id}@helmetpro.internal`,
      password,
    });

    if (tokenError) {
      return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
    }

    return NextResponse.json({ access_token: tokenData.session.access_token }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 