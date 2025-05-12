-- Direct SQL to create the transactions table
-- Run this in your Supabase SQL Editor

-- Create the transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transactions (
  id SERIAL PRIMARY KEY,
  device_id UUID NOT NULL, -- UUID to match your device_list table
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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Service role can do everything on transactions'
  ) THEN
    CREATE POLICY "Service role can do everything on transactions" 
      ON public.transactions
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- Allow authenticated users to read their own transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can view transactions for their devices'
  ) THEN
    CREATE POLICY "Users can view transactions for their devices" 
      ON public.transactions 
      FOR SELECT
      USING (
        device_id IN (
          SELECT device_id FROM public.device_settings
          WHERE machine_id = machine_id
        )
      );
  END IF;
END
$$;

-- Only allow insert from authenticated users on their own machines
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can insert transactions for their devices'
  ) THEN
    CREATE POLICY "Users can insert transactions for their devices" 
      ON public.transactions 
      FOR INSERT
      WITH CHECK (
        device_id IN (
          SELECT device_id FROM public.device_settings
          WHERE machine_id = machine_id
        )
      );
  END IF;
END
$$; 