-- HelmetPro Hardware API Database Schema
-- Contains tables required for the hardware API functionality

-- Devices table to store hardware device information
CREATE TABLE IF NOT EXISTS public.devices (
  id SERIAL PRIMARY KEY,
  machine_id VARCHAR(50) UNIQUE NOT NULL,
  model VARCHAR(100) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  firmware_version VARCHAR(50),
  hardware_version VARCHAR(50),
  status_code INTEGER DEFAULT 200,
  status_description VARCHAR(255) DEFAULT 'Online',
  last_connection TIMESTAMPTZ,
  last_transaction TIMESTAMPTZ,
  last_status_update TIMESTAMPTZ,
  location VARCHAR(255),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0
);

-- Device settings table to store configuration for each device
CREATE TABLE IF NOT EXISTS public.device_settings (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES public.devices(id) ON DELETE CASCADE,
  required_payment_amount NUMERIC(10,2) DEFAULT 50,
  payment_methods VARCHAR[] DEFAULT ARRAY['coin_slot']::VARCHAR[],
  machine_id VARCHAR(50),
  smoke_duration INTEGER DEFAULT 30,
  smoke_repeat_every INTEGER DEFAULT 5,
  uv_light_duration INTEGER DEFAULT 30,
  blower_drying_time INTEGER DEFAULT 60,
  blower_drying_repeat_every INTEGER DEFAULT 10,
  open_door_after INTEGER DEFAULT 120,
  timezone VARCHAR(50) DEFAULT 'Asia/Manila',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id)
);

-- Asset groups to organize images and videos
CREATE TABLE IF NOT EXISTS public.asset_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table to store media files (images, videos, etc.)
CREATE TABLE IF NOT EXISTS public.assets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- banner, icon, video
  file_path VARCHAR(255) NOT NULL,
  group_id INTEGER REFERENCES public.asset_groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Association table between devices and asset groups
CREATE TABLE IF NOT EXISTS public.device_asset_groups (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES public.devices(id) ON DELETE CASCADE,
  asset_group_id INTEGER REFERENCES public.asset_groups(id) ON DELETE CASCADE,
  UNIQUE(device_id, asset_group_id)
);

-- Firmware table to store firmware versions for OTA updates
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

-- Transactions table to record financial transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES public.devices(id) ON DELETE SET NULL,
  machine_id VARCHAR(50) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'coin_slot',
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'completed'
);

-- Device status history table
CREATE TABLE IF NOT EXISTS public.device_status_history (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES public.devices(id) ON DELETE CASCADE,
  machine_id VARCHAR(50) NOT NULL,
  status_code INTEGER NOT NULL,
  status_description TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table for system notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  device_id INTEGER REFERENCES public.devices(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer feedback table
CREATE TABLE IF NOT EXISTS public.customer_feedback (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES public.devices(id) ON DELETE SET NULL,
  machine_id VARCHAR(50) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_devices_machine_id ON public.devices(machine_id);
CREATE INDEX IF NOT EXISTS idx_transactions_device_id ON public.transactions(device_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_status_history_device_id ON public.device_status_history(device_id);
CREATE INDEX IF NOT EXISTS idx_status_history_timestamp ON public.device_status_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_feedback_device_id ON public.customer_feedback(device_id);
CREATE INDEX IF NOT EXISTS idx_notifications_device_id ON public.notifications(device_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at); 