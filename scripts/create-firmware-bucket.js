#!/usr/bin/env node

// This script creates a Supabase Storage bucket for firmware files
// Run with: node scripts/create-firmware-bucket.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Error: Missing Supabase environment variables.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE are set in your .env file.');
  process.exit(1);
}

// Create Supabase client with service role for admin access
const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createFirmwareBucket() {
  try {
    console.log('Checking if firmware bucket exists...');
    
    // Check if the bucket already exists
    const { data: buckets, error: getBucketError } = await supabase.storage.listBuckets();
    
    if (getBucketError) {
      throw new Error(`Failed to list buckets: ${getBucketError.message}`);
    }
    
    const firmwareBucket = buckets.find(bucket => bucket.name === 'firmware');
    
    if (firmwareBucket) {
      console.log('Firmware bucket already exists.');
    } else {
      console.log('Creating firmware bucket...');
      
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket('firmware', {
        public: false,
        allowedMimeTypes: ['application/octet-stream', 'application/x-binary'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (error) {
        throw new Error(`Failed to create firmware bucket: ${error.message}`);
      }
      
      console.log('Firmware bucket created successfully.');
    }
    
    // Ensure firmware database table exists
    console.log('Checking firmware database table...');
    
    const { data: tableExists, error: tableError } = await supabase
      .from('firmware')
      .select('id', { count: 'exact', head: true });
    
    if (tableError) {
      if (tableError.code === '42P01') { // Table does not exist error
        console.log('Creating firmware table...');
        
        // Create the firmware table
        const { error: createTableError } = await supabase.rpc('create_firmware_table');
        
        if (createTableError) {
          console.log('Could not create table via RPC. This may need to be created manually.');
          console.log('Please run the following SQL in your Supabase SQL editor:');
          console.log(`
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
`);
        } else {
          console.log('Firmware table created successfully.');
        }
      } else {
        throw new Error(`Failed to check firmware table: ${tableError.message}`);
      }
    } else {
      console.log('Firmware table already exists.');
    }
    
    console.log('Setup complete!');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

createFirmwareBucket(); 