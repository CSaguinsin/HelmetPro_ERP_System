import { NextRequest, NextResponse } from "next/server";
import { verifyHardwareAuth } from "@/lib/hardware-auth";
import { supabase } from "@/lib/supabase";

// Define types for better type safety
interface Transaction {
  id: string;
  device_id: string;
  machine_id: string;
  amount: number;
  payment_method: string;
  transaction_date: string;
  status: string;
}

/**
 * @swagger
 * /api/hardware/transaction:
 *   post:
 *     summary: Record new transaction
 *     description: Sends transaction data when a machine starts cleaning
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - machineId
 *               - amount
 *             properties:
 *               machineId:
 *                 type: string
 *               amount:
 *                 type: number
 *               payment_method:
 *                 type: string
 *                 enum: [coin_slot, bill_acceptor, card_only]
 *     responses:
 *       201:
 *         description: Transaction recorded successfully
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest): Promise<Response> {
  // Verify auth token
  const { authenticated, response, device } = await verifyHardwareAuth(req);
  
  if (!authenticated || !device) {
    return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  try {
    // Parse request body
    const { machineId, amount, payment_method } = await req.json();

    // Validate required fields
    if (!machineId || amount === undefined) {
      return NextResponse.json({ 
        error: "Machine ID and amount are required" 
      }, { status: 400 });
    }

    // Validate machine ID matches the authenticated device
    if (machineId !== device.machine_id) {
      return NextResponse.json({ 
        error: "Machine ID doesn't match the authenticated device" 
      }, { status: 400 });
    }

    // Record transaction in database
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        device_id: device.id,
        machine_id: machineId,
        amount,
        payment_method: payment_method || "coin_slot", // Default to coin slot if not specified
        transaction_date: new Date().toISOString(),
        status: "completed"
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 });
    }

    // Update device last transaction date
    await supabase
      .from("devices")
      .update({ last_transaction: new Date().toISOString() })
      .eq("id", device.id);

    return NextResponse.json({ 
      message: "Transaction recorded successfully", 
      transaction_id: data.id 
    }, { status: 201 });
  } catch (err) {
    console.error("Error recording transaction:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/hardware/transaction:
 *   get:
 *     summary: Get device transaction history
 *     description: Retrieves recent transactions for the authenticated device
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(req: NextRequest): Promise<Response> {
  // Verify auth token
  const { authenticated, response, device } = await verifyHardwareAuth(req);
  
  if (!authenticated || !device) {
    return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  try {
    // Get recent transactions for this device
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("device_id", device.id)
      .order("transaction_date", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }

    return NextResponse.json({ 
      transactions: transactions as Transaction[] || [] 
    }, { status: 200 });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 