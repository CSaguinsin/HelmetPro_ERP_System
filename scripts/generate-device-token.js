#!/usr/bin/env node

/**
 * Generate a test device token for the Status API
 * 
 * This script generates a simple token for testing machine-to-machine
 * authentication with the Hardware API.
 * 
 * Usage:
 *   node generate-device-token.js <device_id>
 */

// Get device ID from command line argument
const deviceId = process.argv[2];

if (!deviceId) {
  console.error('Error: Device ID is required');
  console.log('Usage: node generate-device-token.js <device_id>');
  process.exit(1);
}

// Create a simple test token with the device ID
const token = {
  device_id: deviceId,
  timestamp: Date.now(),
  exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours expiration
  sig: Buffer.from(`${deviceId}:${Date.now()}:test`).toString('base64')
};

// Encode the token
const encodedToken = Buffer.from(JSON.stringify(token)).toString('base64');

console.log('\n=== Device Test Token ===');
console.log('Device ID:', deviceId);
console.log('Token:', encodedToken);
console.log('\nUse this token in the access_token header or in the SendStatus component\'s access token field.');
console.log('\nCURL Example:');
console.log(`curl -X POST http://localhost:3000/api/hardware/status \\
  -H "Content-Type: application/json" \\
  -H "access_token: ${encodedToken}" \\
  -d '{"code": 100, "description": "Machine idle"}'`);

console.log('\nOr for direct device ID reference:');
console.log(`curl -X POST http://localhost:3000/api/hardware/status \\
  -H "Content-Type: application/json" \\
  -d '{"code": 100, "description": "Machine idle", "device_id": "${deviceId}"}'`);

// Done
console.log('\nToken will expire in 24 hours.'); 