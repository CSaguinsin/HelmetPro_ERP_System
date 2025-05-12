# Hardware API Documentation

This directory contains API endpoints for hardware device integration with the HelmetPro ERP system.

## Authentication

The Hardware API supports two authentication methods:

1. **JWT Tokens** (from Supabase Auth)
   - Use the `Authorization: Bearer <token>` header
   - Obtained via device login with username/password

2. **Fallback Tokens**
   - Use the `access_token: <token>` header
   - Optionally include `x-user-client-id: <client_id>` for additional verification
   - Used for user authentication when JWT is not available

## Available Endpoints

### Login (`/api/hardware/login`)

Authenticates a user or device and returns an access token.

- **Method:** POST
- **Body:**
  ```json
  {
    "username": "string", // Device username
    "email": "string",    // User email (alternative to username)
    "password": "string"  // Required
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "string"
  }
  ```

### Device Details (`/api/hardware/device-details`)

Retrieves detailed information about the authenticated device.

- **Methods:** GET, POST
- **Headers:** Authorization or access_token (see Authentication)
- **Query Parameters:**
  - `device_id` - Optional device ID to retrieve a specific device
  - `test_mode` - When set to true, returns sample device data for testing (development only)
- **Response:**
  ```json
  {
    "device": {
      "id": "string",
      "machine_id": "string",
      "model": "string",
      "firmware_version": "string",
      "hardware_version": "string",
      "last_connection": "string",
      "status": "string",
      "location": "string",
      "registered_at": "string"
    }
  }
  ```

### Assets (`/api/hardware/assets`)

Retrieves or uploads media assets for the device.

- **Methods:** GET, POST
- **Headers:** Authorization or access_token (see Authentication)
- **Query Parameters:**
  - `test_mode` - When set to true, returns sample asset data for testing (development only)

#### GET - Retrieve Assets

- **Response:**
  ```json
  {
    "assets": [
      {
        "id": "string",
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ]
  }
  ```

#### POST - Upload Asset

- **Content-Type:** multipart/form-data
- **Form Fields:**
  - `file` - The file to upload (required)
  - `name` - Display name for the asset (required)
  - `type` - Type of asset: banner, icon, video, or image (required)
- **Response:**
  ```json
  {
    "file": {
      "id": "string",
      "name": "string",
      "url": "string"
    }
  }
  ```

### Status (`/api/hardware/status`)

Reports device status updates and retrieves status history.

- **Methods:** POST, GET
- **Headers:** Authorization or access_token (see Authentication)
- **Query Parameters:**
  - `test_mode` - When set to true, returns sample data or accepts test requests without authentication (development only)

#### POST - Send Status Update

- **Body:**
  ```json
  {
    "code": 100,           // Status code (required)
    "description": "string" // Status description (required)
  }
  ```
- **Response:**
  ```json
  {
    "message": "Status updated successfully",
    "success": true
  }
  ```

#### GET - Retrieve Status History

- **Response:**
  ```json
  {
    "current_status": {
      "code": 100,
      "description": "string",
      "last_updated": "string"
    },
    "status_history": [
      {
        "id": "string",
        "device_id": "string",
        "machine_id": "string",
        "status_code": 100,
        "status_description": "string",
        "timestamp": "string"
      }
    ]
  }
  ```

## Testing

You can test these endpoints using curl:

```bash
# Login
curl -X POST http://localhost:3000/api/hardware/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@helmetprosolutions.com", "password": "your-password"}'

# Device details with JWT token
curl -X GET http://localhost:3000/api/hardware/device-details \
  -H "Authorization: Bearer YOUR_TOKEN"

# Device details with fallback token
curl -X GET http://localhost:3000/api/hardware/device-details \
  -H "access_token: YOUR_TOKEN"

# Device details with specific device ID
curl -X GET http://localhost:3000/api/hardware/device-details?device_id=1 \
  -H "access_token: YOUR_TOKEN"

# Get assets
curl -X GET http://localhost:3000/api/hardware/assets \
  -H "access_token: YOUR_TOKEN"

# Upload asset
curl -X POST http://localhost:3000/api/hardware/assets \
  -H "access_token: YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "name=My Image" \
  -F "type=image"

# Test mode (development only)
curl -X GET http://localhost:3000/api/hardware/device-details?test_mode=true
curl -X GET http://localhost:3000/api/hardware/assets?test_mode=true

# Send status update
curl -X POST http://localhost:3000/api/hardware/status \
  -H "access_token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": 100, "description": "Machine idle"}'

# Get status history
curl -X GET http://localhost:3000/api/hardware/status \
  -H "access_token: YOUR_TOKEN"

# Test mode (development only)
curl -X POST http://localhost:3000/api/hardware/status \
  -H "Content-Type: application/json" \
  -d '{"code": 100, "description": "Machine idle", "test_mode": true}'
```

## Debugging

If you encounter authentication issues:

1. Check that you're using the correct token format
2. Verify the token is valid and not expired
3. For device endpoints, ensure a device is associated with the authenticated user
4. Check server logs for detailed error information 