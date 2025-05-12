-- Create firmware table
CREATE TABLE IF NOT EXISTS public.firmware (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  device_model VARCHAR(100) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  md5_hash VARCHAR(32) NOT NULL,
  release_notes TEXT,
  release_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(version, device_model)
);

-- Add RLS policies
ALTER TABLE public.firmware ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role can do everything" ON public.firmware
  USING (true)
  WITH CHECK (true);

-- Add firmware RPC function 
CREATE OR REPLACE FUNCTION public.create_firmware_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function is used by the create-firmware-bucket.js script
  -- It's already created by this migration, so it's just a no-op
  RAISE NOTICE 'Firmware table already exists';
END;
$$; 