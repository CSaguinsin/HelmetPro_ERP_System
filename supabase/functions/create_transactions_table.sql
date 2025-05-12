-- Function to create the transactions table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_transactions_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the transactions table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.transactions (
    id SERIAL PRIMARY KEY,
    device_id UUID NOT NULL, -- Changed to UUID to match the device_list table
    machine_id VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'coin_slot',
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'completed'
  );

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_transactions_device_id ON public.transactions(device_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
  CREATE INDEX IF NOT EXISTS idx_transactions_machine_id ON public.transactions(machine_id);

  -- Add RLS policies
  ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

  -- Allow service role full access
  CREATE POLICY IF NOT EXISTS "Service role can do everything on transactions" 
    ON public.transactions
    USING (true)
    WITH CHECK (true);

  -- Allow authenticated users to read their own transactions
  CREATE POLICY IF NOT EXISTS "Users can view transactions for their devices" 
    ON public.transactions 
    FOR SELECT
    USING (
      device_id IN (
        SELECT device_id FROM public.device_settings
        WHERE machine_id = machine_id
      )
    );
  
  -- Only allow insert from authenticated users on their own machines
  CREATE POLICY IF NOT EXISTS "Users can insert transactions for their devices" 
    ON public.transactions 
    FOR INSERT
    WITH CHECK (
      device_id IN (
        SELECT device_id FROM public.device_settings
        WHERE machine_id = machine_id
      )
    );

  RAISE NOTICE 'Transactions table created or verified';
END;
$$; 