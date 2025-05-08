# HelmetPro Hardware API Documentation

## Overview

This documentation provides detailed technical specifications for the HelmetPro Hardware API, which enables communication between HelmetPro cleaning devices and the ERP system. The API is built using Next.js API routes and Supabase for authentication and data persistence.

## Tech Stack

- **Framework**: Next.js API Routes (Node.js)
- **Authentication**: JWT tokens via Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **Documentation**: Swagger/OpenAPI (available at `/api-docs`)

## Authentication

The API uses JWT Bearer token authentication. All endpoints except `/api/hardware/login` require authentication.

### Obtaining a Token

```http
POST /api/hardware/login
Content-Type: application/json

{
  "username": "device_username",
  "password": "device_password"
}
```

#### Response (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using Authentication

Include the token in all subsequent requests:

```http
GET /api/hardware/device-details
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authentication Errors (401 Unauthorized)

```json
{
  "error": "Unauthorized: Access token required"
}
```

## API Endpoints

### 1. Device Details

Provides information about the authenticated device.

#### Request

```http
GET /api/hardware/device-details
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response (200 OK)

```json
{
  "device": {
    "id": 123,
    "machine_id": "HELMETPRO-001",
    "model": "HP-2000",
    "firmware_version": "1.2.3",
    "hardware_version": "A2",
    "last_connection": "2025-05-08T15:30:45Z",
    "status": "Online",
    "location": "Shopping Mall, Manila",
    "registered_at": "2025-01-15T08:00:00Z"
  }
}
```

#### POST Alternative

The endpoint also supports `POST` method with the same response format.

### 2. Assets/Media

Retrieves URLs for images, ads, and other media to be displayed on the device.

#### Request

```http
GET /api/hardware/assets
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response (200 OK)

```json
{
  "assets": [
    {
      "id": "1",
      "type": "banner",
      "name": "Welcome Banner",
      "url": "https://storage.example.com/assets/welcome-banner.jpg?token=..."
    },
    {
      "id": "2",
      "type": "video",
      "name": "How to Use",
      "url": "https://storage.example.com/assets/tutorial.mp4?token=..."
    }
  ]
}
```

#### Implementation Notes

- URLs are signed Supabase storage URLs with 24-hour expiry
- Assets are filtered by asset groups assigned to the device
- The endpoint also supports `POST` method with the same response format

### 3. Firmware Updates

Provides OTA firmware update files for device CPU updates.

#### Request with Query Parameter

```http
GET /api/hardware/firmware?version=1.2.3
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Request with POST Method

```http
POST /api/hardware/firmware
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "version": "1.2.3"
}
```

#### Response (200 OK) - Update Available

```json
{
  "version": "1.3.0",
  "bin_url": "https://storage.example.com/firmware/helmetpro-v1.3.0.bin?token=...",
  "md5_hash": "a1b2c3d4e5f6...",
  "release_notes": "Bug fixes and performance improvements"
}
```

#### Response (204 No Content) - No Update Available

Empty response with 204 status code indicates no update is available.

### 4. Device Settings

Retrieves configuration settings for the device.

#### Request

```http
GET /api/hardware/settings
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response (200 OK)

```json
{
  "settings": {
    "required_payment_amount": 50,
    "payment_methods": ["coin_slot", "bill_acceptor"],
    "machine_id": "HELMETPRO-001",
    "smoke_duration": 30,
    "smoke_repeat_every": 5,
    "uv_light_duration": 30,
    "blower_drying_time": 60,
    "blower_drying_repeat_every": 10,
    "open_door_after": 120,
    "timezone": "Asia/Manila"
  }
}
```

#### Implementation Notes

- Default values are provided if no settings are found
- Payment methods can be: `coin_slot`, `bill_acceptor`, or `card_only`
- All durations are in seconds
- The endpoint also supports `POST` method with the same response format

### 5. Transactions

Records financial transactions when a cleaning session starts.

#### Request

```http
POST /api/hardware/transaction
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "machineId": "HELMETPRO-001",
  "amount": 50,
  "payment_method": "coin_slot"
}
```

#### Response (201 Created)

```json
{
  "message": "Transaction recorded successfully",
  "transaction_id": 12345
}
```

#### Getting Transaction History

```http
GET /api/hardware/transaction
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response (200 OK)

```json
{
  "transactions": [
    {
      "id": 12345,
      "machine_id": "HELMETPRO-001",
      "amount": 50,
      "payment_method": "coin_slot",
      "transaction_date": "2025-05-08T16:30:45Z",
      "status": "completed"
    },
    // More transactions...
  ]
}
```

### 6. Status Updates

Reports the current status of the device.

#### Request

```http
POST /api/hardware/status
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "code": 200,
  "description": "Device operating normally"
}
```

#### Response (200 OK)

```json
{
  "message": "Status updated successfully"
}
```

#### Implementation Notes

- Status codes follow HTTP convention (200s for normal, 400s+ for errors)
- Error statuses (codes ≥ 400) trigger notifications in the ERP system
- Status history is maintained for monitoring and diagnostics

#### Getting Status History

```http
GET /api/hardware/status
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response (200 OK)

```json
{
  "current_status": {
    "code": 200,
    "description": "Device operating normally",
    "last_updated": "2025-05-08T16:45:12Z"
  },
  "status_history": [
    {
      "id": 5001,
      "status_code": 200,
      "status_description": "Device operating normally",
      "timestamp": "2025-05-08T16:45:12Z"
    },
    {
      "id": 5000,
      "status_code": 503,
      "status_description": "Service interrupted - power failure",
      "timestamp": "2025-05-08T14:30:00Z"
    },
    // More status history...
  ]
}
```

### 7. Customer Feedback

Records customer satisfaction ratings after using the cleaning service.

#### Request

```http
POST /api/hardware/feedback
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "machineId": "HELMETPRO-001",
  "rating": 5,
  "comments": "Great service, very clean!"
}
```

#### Response (201 Created)

```json
{
  "message": "Feedback recorded successfully"
}
```

#### Implementation Notes

- Ratings must be integers between 1-5
- Comments are optional
- Device average rating is automatically recalculated

#### Getting Feedback History

```http
GET /api/hardware/feedback
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response (200 OK)

```json
{
  "avg_rating": 4.7,
  "total_ratings": 156,
  "recent_feedback": [
    {
      "id": 789,
      "rating": 5,
      "comments": "Great service, very clean!",
      "submitted_at": "2025-05-08T17:15:30Z"
    },
    // More feedback entries...
  ]
}
```

## Error Handling

All endpoints follow standard HTTP status codes:

- **200 / 201**: Success
- **204**: No content (success but no data to return)
- **400**: Bad request (validation error, missing fields)
- **401**: Unauthorized (missing or invalid token)
- **500**: Server error

Error responses follow a consistent format:

```json
{
  "error": "Detailed error message"
}
```

## Database Schema

The API interacts with the following database tables:

- `devices`: Stores device information and credentials
- `device_settings`: Stores configuration settings
- `assets` & `asset_groups`: Manage media files
- `firmware`: Stores firmware versions for OTA updates
- `transactions`: Records financial transactions
- `device_status_history`: Tracks device status over time
- `notifications`: Stores system notifications
- `customer_feedback`: Records customer ratings

## Implementation Details

### Authentication Flow

1. Device sends credentials to `/api/hardware/login`
2. System verifies credentials against the `devices` table
3. Supabase Auth generates a JWT token
4. Token is used for subsequent requests
5. `verifyHardwareAuth` middleware validates token and attaches device info

### Response Times

- Most endpoints are designed to respond within 200-300ms
- Asset endpoints might take longer depending on the number of assets
- Firmware endpoint might take longer for large binary files

## Security Considerations

- All endpoints require authentication except login
- HTTPS is enforced for all API communication
- JWT tokens expire after 30 days
- Database queries use parameterized statements to prevent SQL injection
- Access is restricted to registered devices only

## Debugging

For debugging purpose, check these common issues:

1. **401 Unauthorized**: Verify token is valid and correctly formatted
2. **Device not found**: Ensure device is registered in the database
3. **Storage URL issues**: Check Supabase storage bucket permissions

## Interactive Documentation

For interactive API testing and detailed schema information, visit the Swagger UI documentation:

- `/api-docs` - Interactive API documentation

## Development and Testing

For local testing, use the following flow:

1. Register a test device in the database
2. Obtain a token via the login endpoint
3. Use the token for testing other endpoints
4. Check response status codes and formats

## Changelog

- v1.0.0 (2025-05-08): Initial API implementation 