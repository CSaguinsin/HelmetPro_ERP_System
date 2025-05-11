// Simple script to test the device-details API endpoint
async function testApi() {
  try {
    console.log('Testing GET /api/hardware/device-details...');
    const response = await fetch('http://localhost:3000/api/hardware/device-details');
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi(); 