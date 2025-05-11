// This script creates a test device and associates it with the admin user
// Run with: node scripts/create-and-associate-device.js

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Create Supabase client using environment variables or defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://juxepsjuoltvzmvvyznz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1eGVwc2p1b2x0dnptdnZ5em56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MzYwMTYsImV4cCI6MjA2MjUxMjAxNn0.DfnkgF8iBw88-ciBXk6Q7oqzStbmkCSl6rrCBSQ075s';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log('Finding admin user...');
    
    // Get admin user by email
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@helmetprosolutions.com')
      .single();
      
    if (userError) {
      console.error('Error finding admin user:', userError);
      return;
    }
    
    console.log('Found admin user:', adminUser.email);
    
    // Generate a secure password hash for device
    const passwordHash = await bcrypt.hash('devicetest123', 10);
    
    // Create a test device
    const deviceData = {
      machine_id: 'HELMETPRO-ADMIN-TEST-001',
      model: 'HelmetPro X2',
      firmware_version: '2.0.1',
      hardware_version: '1.0.0',
      status: 'active',
      username: 'admindevice',
      password_hash: passwordHash,
      location: 'Admin Office',
      registered_at: new Date().toISOString()
    };
    
    console.log('Creating test device...');
    
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .insert(deviceData)
      .select()
      .single();
      
    if (deviceError) {
      console.error('Error creating device:', deviceError);
      return;
    }
    
    console.log('Created device with ID:', device.id);
    
    // Create a default asset group for the device
    console.log('Creating default asset group...');
    
    const { data: assetGroup, error: groupError } = await supabase
      .from('asset_groups')
      .insert({
        name: `Admin Test Device Group`,
        device_id: device.id,
        is_default: true
      })
      .select()
      .single();
      
    if (groupError) {
      console.error('Error creating asset group:', groupError);
      // Continue anyway
    } else {
      console.log('Created asset group with ID:', assetGroup.id);
      
      // Link device to asset group
      const { error: linkError } = await supabase
        .from('device_asset_groups')
        .insert({
          device_id: device.id,
          asset_group_id: assetGroup.id
        });
        
      if (linkError) {
        console.error('Error linking device to asset group:', linkError);
      } else {
        console.log('Linked device to asset group');
      }
    }
    
    // Associate device with admin user
    console.log('Associating device with admin user...');
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ device_id: device.id })
      .eq('id', adminUser.id);
      
    if (updateError) {
      console.error('Error associating device with user:', updateError);
      return;
    }
    
    console.log('✅ Successfully associated device with admin user');
    console.log('\nDevice credentials:');
    console.log('Username:', deviceData.username);
    console.log('Password: devicetest123');
    console.log('Device ID:', device.id);
    console.log('\nNow you can run the API tests with a real device associated with your account.');
    
  } catch (err) {
    console.error('Script error:', err);
  }
}

// Execute the main function
main(); 