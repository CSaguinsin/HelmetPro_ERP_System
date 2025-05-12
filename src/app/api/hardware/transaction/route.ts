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

// Helper function to ensure database table exists
async function ensureTransactionsTable() {
  try {
    // First check if the table already exists
    const { error: checkError } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);
    
    // If the table exists, no need to create it
    if (!checkError) {
      return;
    }
    
    // If the table doesn't exist, try to call the function
    if (checkError && checkError.message.includes('does not exist')) {
      console.warn('Transactions table not found, attempting to create it');
      
      try {
        // Try to call the create_transactions_table function
        const { error: createError } = await supabase
          .rpc('create_transactions_table');
        
        if (createError) {
          console.error('Failed to create transactions table using RPC:', createError);
          
          // If the function doesn't exist, create the table directly
          if (createError.message.includes('does not exist')) {
            console.warn('Function create_transactions_table does not exist, creating table directly');
            
            // Create the table directly
            const { error: directCreateError } = await supabase.rpc('exec_sql', { 
              sql: `
                CREATE TABLE IF NOT EXISTS public.transactions (
                  id SERIAL PRIMARY KEY,
                  device_id UUID NOT NULL,
                  machine_id VARCHAR(50) NOT NULL,
                  amount NUMERIC(10,2) NOT NULL,
                  payment_method VARCHAR(50) DEFAULT 'coin_slot',
                  transaction_date TIMESTAMPTZ DEFAULT NOW(),
                  status VARCHAR(50) DEFAULT 'completed'
                );
                
                CREATE INDEX IF NOT EXISTS idx_transactions_device_id ON public.transactions(device_id);
                CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
              `
            });
            
            if (directCreateError) {
              console.error('Failed to create transactions table directly:', directCreateError);
              throw new Error('Failed to initialize transactions system');
            }
          } else {
            throw new Error('Failed to initialize transactions system');
          }
        }
      } catch (err) {
        console.error('Error creating transactions table:', err);
        throw new Error('Failed to initialize transactions system');
      }
    }
  } catch (err) {
    console.error('Error checking for transactions table:', err);
    throw new Error('Failed to initialize transactions system');
  }
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
 *               test_mode:
 *                 type: boolean
 *                 description: If true, returns test data (for development only)
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
  try {
    // Ensure transactions table exists
    await ensureTransactionsTable();
    
    // Parse request body first to check for test_mode
    const body = await req.json();
    const { machineId, amount, payment_method, test_mode, device_id } = body;
    
    // Handle test mode for development
    if (test_mode === true) {
      console.log("Transaction endpoint running in test mode");
      return NextResponse.json({ 
        message: "Transaction recorded successfully (TEST MODE)", 
        transaction_id: "test-transaction-" + Date.now(),
        success: true
      }, { status: 201 });
    }
    
    // Check for direct device_id in body for simplified machine-to-machine communication
    if (device_id) {
      console.log(`Using direct device ID: ${device_id} from request body`);
      // Validate required fields
      if (!machineId || amount === undefined) {
        return NextResponse.json({ 
          error: "Machine ID and amount are required" 
        }, { status: 400 });
      }

      try {
        // Verify device exists
        const { data: deviceData, error: deviceError } = await supabase
          .from("device_list")
          .select("*")
          .eq("device_id", device_id)
          .single();

        if (deviceError || !deviceData) {
          console.error("Device not found:", deviceError);
          return NextResponse.json({ error: "Device not found" }, { status: 401 });
        }

        // Record transaction in database
        const { data, error } = await supabase
          .from("transactions")
          .insert({
            device_id,
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

        // Update device last transaction time if possible (optional)
        try {
          // Try to find the device in device_list and update it
          const { error: updateError } = await supabase
            .from("device_list")
            .update({ last_updated: new Date().toISOString() })
            .eq("device_id", device_id);
          
          if (updateError) {
            console.warn("Could not update device last transaction time:", updateError);
            // Continue anyway as this is not critical
          }
        } catch (updateErr) {
          console.warn("Error updating device timestamp:", updateErr);
          // Continue anyway as this is not critical
        }

        return NextResponse.json({ 
          message: "Transaction recorded successfully", 
          transaction_id: data.id,
          success: true
        }, { status: 201 });
      } catch (dbError) {
        console.error("Database operation error:", dbError);
        return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
      }
    }
    
    // Regular auth flow using token
    // For non-test mode, verify auth token
    const { authenticated, response, device } = await verifyHardwareAuth(req);
    
    if (!authenticated || !device) {
      return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

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
        device_id: device.device_id,
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

    // Update device last transaction time if possible (optional)
    try {
      // Try to find the device in device_list and update it
      const { error: updateError } = await supabase
        .from("device_list")
        .update({ last_updated: new Date().toISOString() })
        .eq("device_id", device.device_id);
      
      if (updateError) {
        console.warn("Could not update device last transaction time:", updateError);
        // Continue anyway as this is not critical
      }
    } catch (updateErr) {
      console.warn("Error updating device timestamp:", updateErr);
      // Continue anyway as this is not critical
    }

    return NextResponse.json({ 
      message: "Transaction recorded successfully", 
      transaction_id: data.id,
      success: true
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
 *     parameters:
 *       - in: query
 *         name: test_mode
 *         schema:
 *           type: boolean
 *         description: If true, returns test data (for development only)
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
  try {
    // Ensure transactions table exists
    await ensureTransactionsTable();
    
    // Check for test_mode
    const url = new URL(req.url);
    const testMode = url.searchParams.get('test_mode') === 'true';
    
    if (testMode) {
      console.log("Transaction endpoint running in test mode");
      // Generate test transactions
      const testTransactions = [
        {
          id: "test-transaction-1",
          device_id: "1",
          machine_id: "TEST-MACHINE-001",
          amount: 50,
          payment_method: "coin_slot",
          transaction_date: new Date().toISOString(),
          status: "completed"
        },
        {
          id: "test-transaction-2",
          device_id: "1",
          machine_id: "TEST-MACHINE-001",
          amount: 75,
          payment_method: "bill_acceptor",
          transaction_date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          status: "completed"
        }
      ];
      
      return NextResponse.json({ 
        transactions: testTransactions
      }, { status: 200 });
    }
    
    // For non-test mode, verify auth token
    const { authenticated, response, device } = await verifyHardwareAuth(req);
    
    if (!authenticated || !device) {
      return response || NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // Get recent transactions for this device
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("device_id", device.device_id)
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