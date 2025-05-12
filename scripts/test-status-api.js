#!/usr/bin/env node

/**
 * Test script for the Status API
 * 
 * This script sends a status update to the Status API endpoint
 * and checks the response.
 * 
 * Usage:
 *   node test-status-api.js [access_token]
 */

const fetch = require('node-fetch');
const API_URL = 'http://localhost:3000/api/hardware/status';

async function testStatusUpdate(accessToken) {
  console.log('Testing Status API...');
  
  // Test data
  const statusData = {
    code: 100,
    description: 'Test status update from API test script'
  };
  
  // Headers
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (accessToken) {
    console.log('Using provided access token');
    headers['access_token'] = accessToken;
  } else {
    console.log('No access token provided, using test mode');
    statusData.test_mode = true;
  }
  
  try {
    console.log(`Sending request to ${API_URL}`);
    console.log('Request data:', statusData);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(statusData)
    });
    
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ Test succeeded!');
    } else {
      console.log('❌ Test failed!');
    }
  } catch (error) {
    console.error('Error:', error);
    console.log('❌ Test failed with an exception!');
  }
}

// Get access token from command line args
const accessToken = process.argv[2];
testStatusUpdate(accessToken); 