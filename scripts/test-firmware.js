/**
 * Test script for firmware upload and download
 * 
 * This script tests:
 * 1. Uploading a test firmware file
 * 2. Retrieving the firmware list
 * 3. Downloading a firmware file
 * 
 * Usage:
 * node scripts/test-firmware.js <auth_token>
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Get auth token from command line
const authToken = process.argv[2];

if (!authToken) {
  console.error('Usage: node scripts/test-firmware.js <auth_token>');
  process.exit(1);
}

// Test configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_VERSION = '1.0.0-test';
const TEST_DEVICE_MODEL = 'HelmetPro Test';
const TEST_FIRMWARE_PATH = path.join(__dirname, 'test-firmware.bin');

// Create a test binary file if it doesn't exist
if (!fs.existsSync(TEST_FIRMWARE_PATH)) {
  console.log('Creating test firmware file...');
  // Create a small binary file with dummy data
  const buffer = Buffer.alloc(1024);
  buffer.fill('FIRMWARE_TEST_DATA');
  fs.writeFileSync(TEST_FIRMWARE_PATH, buffer);
}

// Headers with authentication
const getHeaders = () => {
  if (authToken.includes('.')) {
    // JWT token
    return {
      'Authorization': `Bearer ${authToken}`
    };
  } else {
    // Custom token
    return {
      'access_token': authToken
    };
  }
};

// Step 1: Upload firmware
async function uploadFirmware() {
  console.log('Testing firmware upload...');
  
  const formData = new FormData();
  formData.append('file', fs.createReadStream(TEST_FIRMWARE_PATH));
  formData.append('version', TEST_VERSION);
  formData.append('deviceModel', TEST_DEVICE_MODEL);
  formData.append('releaseNotes', 'Test firmware upload');
  
  const headers = getHeaders();
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/firmware`, {
      method: 'POST',
      headers: {
        ...headers,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload firmware');
    }
    
    console.log('✅ Firmware upload successful!');
    console.log('Firmware ID:', result.data.id);
    
    return result.data;
  } catch (error) {
    console.error('❌ Firmware upload failed:', error.message);
    throw error;
  }
}

// Step 2: Get firmware list
async function getFirmwareList() {
  console.log('\nTesting firmware list retrieval...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/firmware`, {
      headers: getHeaders()
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get firmware list');
    }
    
    console.log('✅ Firmware list retrieved successfully!');
    console.log(`Found ${result.firmwareList.length} firmware versions`);
    
    return result.firmwareList;
  } catch (error) {
    console.error('❌ Firmware list retrieval failed:', error.message);
    throw error;
  }
}

// Step 3: Test firmware download
async function testFirmwareDownload(version = TEST_VERSION) {
  console.log('\nTesting firmware download API...');
  
  try {
    // Simulate a device request for the firmware
    const response = await fetch(`${API_BASE_URL}/hardware/firmware?version=0.9.0`, {
      headers: getHeaders()
    });
    
    if (response.status === 204) {
      console.log('No newer firmware available (HTTP 204)');
      return null;
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to download firmware');
    }
    
    const result = await response.json();
    
    console.log('✅ Firmware download API successful!');
    console.log('Available firmware:', result.version);
    console.log('Download URL:', result.bin_url);
    
    // Optional: Actually download the firmware binary
    console.log('\nDownloading the actual binary file...');
    const downloadResponse = await fetch(result.bin_url);
    
    if (!downloadResponse.ok) {
      throw new Error('Failed to download the binary file');
    }
    
    const fileBuffer = await downloadResponse.buffer();
    const downloadPath = path.join(__dirname, 'downloaded-firmware.bin');
    fs.writeFileSync(downloadPath, fileBuffer);
    
    console.log(`✅ Binary file downloaded successfully to ${downloadPath}`);
    console.log(`File size: ${fileBuffer.length} bytes`);
    
    return result;
  } catch (error) {
    console.error('❌ Firmware download failed:', error.message);
    throw error;
  }
}

// Step 4: Clean up (delete test firmware)
async function cleanupTestFirmware(firmwareId) {
  console.log('\nCleaning up test firmware...');
  
  if (!firmwareId) {
    console.log('No firmware ID provided, skipping cleanup');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/firmware?id=${firmwareId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete firmware');
    }
    
    console.log('✅ Test firmware deleted successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

// Run the tests
async function runTests() {
  let uploadedFirmware = null;
  
  try {
    // Step 1: Upload firmware
    uploadedFirmware = await uploadFirmware();
    
    // Step 2: Get firmware list
    await getFirmwareList();
    
    // Step 3: Test firmware download
    await testFirmwareDownload();
    
    // Success message
    console.log('\n✅ All firmware tests passed successfully!');
  } catch (error) {
    console.error('\n❌ Test sequence failed!', error);
  } finally {
    // Clean up (delete test firmware)
    if (uploadedFirmware) {
      await cleanupTestFirmware(uploadedFirmware.id);
    }
  }
}

// Start the tests
runTests(); 