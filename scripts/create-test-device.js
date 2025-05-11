// This script creates a test device and associates it with the admin user
// Run with: node scripts/create-test-device.js

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Create Supabase client - using production values for testing
const supabaseUrl = 'https://juxepsjuoltvzmvvyznz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1eGVwc2p1b2x0dnptdnZ5em56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MzYwMTYsImV4cCI6MjA2MjUxMjAxNn0.DfnkgF8iBw88-ciBXk6Q7oqzStbmkCSl6rrCBSQ075s';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log('Creating test device...');
    
    // Get admin user
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@helmetprosolutions.com')
      .single();
      
    if (userError) {
      console.error('Error getting admin user:', userError);
      return;
    }
    
    console.log('Found admin user:', adminUser.email);
    
    // Create password hash
    const passwordHash = await bcrypt.hash('device123', 10);
    
    // Create test device
    const deviceData = {
      machine_id: 'TEST001',
      model: 'Test Model',
      firmware_version: '1.0.0',
      hardware_version: '1.0.0',
      status: 'active',
      username: 'testdevice',
      password_hash: passwordHash,
      registered_at: new Date().toISOString()
    };
    
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .insert(deviceData)
      .select()
      .single();
      
    if (deviceError) {
      console.error('Error creating device:', deviceError);
      return;
    }
    
    console.log('Created device:', device);
    
    // Update admin user with device_id
    const { error: updateError } = await supabase
      .from('users')
      .update({ device_id: device.id })
      .eq('id', adminUser.id);
      
    if (updateError) {
      console.error('Error associating device with user:', updateError);
      return;
    }
    
    console.log('Associated device with admin user');
    console.log('Done!');
    
    // Device credentials for testing:
    console.log('\nDevice login credentials:');
    console.log('Username: testdevice');
    console.log('Password: device123');
    console.log('Device ID:', device.id);
    
  } catch (err) {
    console.error('Script error:', err);
  }
}

main(); 