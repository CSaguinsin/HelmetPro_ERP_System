# HelmetPro Firmware Update System

This document explains how the OTA (Over-The-Air) firmware update system works for HelmetPro devices.

## System Architecture

The firmware update system consists of:

1. **API Endpoints** - Server-side endpoints for both checking/downloading firmware and uploading new firmware versions
2. **Admin UI** - Interface for administrators to manage firmware versions
3. **Device Client** - Code running on HelmetPro devices to check for and apply updates

## How It Works

### For Administrators

1. **Upload Firmware**: 
   - Access the admin dashboard
   - Navigate to the Firmware Management section
   - Upload a new firmware file (.bin format)
   - Specify version number, device model, and release notes
   - The system will automatically calculate the MD5 checksum for verification

2. **Manage Firmware**:
   - View all available firmware versions
   - Delete outdated firmware versions
   - Filter by device model

### For Devices

1. **Check for Updates**:
   - The device periodically calls `/api/hardware/firmware?version=X.Y.Z` with its current version
   - If a newer version is available, the API returns the firmware information (version, download URL, MD5 hash)
   - If no update is needed, the API returns status 204 (No Content)

2. **Download and Install**:
   - The device downloads the firmware from the provided signed URL
   - The MD5 hash is verified to ensure integrity
   - The device installs the firmware and restarts

## Security Considerations

The firmware update system includes several security measures:

1. **Authentication** - All firmware API calls require proper device authentication
2. **Signed URLs** - Firmware binary downloads use time-limited signed URLs
3. **MD5 Verification** - The firmware is verified using MD5 checksums
4. **Admin-only Upload** - Only administrators can upload new firmware
5. **Secure Storage** - Firmware binary files are stored in Supabase secure storage

## Implementation

### API Endpoints

#### 1. GET /api/hardware/firmware
- Used by devices to check for updates
- Requires device authentication
- Parameters: `version` (current firmware version)
- Returns: Firmware information or 204 if no update is needed

#### 2. POST /api/hardware/firmware  
- Alternative to the GET method (for devices that prefer POST)
- Same functionality as GET, but takes version in the request body

#### 3. GET /api/admin/firmware
- Used by admins to list all firmware versions
- Requires admin authentication
- Optional parameters: `deviceModel` for filtering

#### 4. POST /api/admin/firmware
- Used to upload new firmware
- Requires admin authentication
- Form data: `file`, `version`, `deviceModel`, `releaseNotes` (optional), `releaseDate` (optional)

#### 5. DELETE /api/admin/firmware
- Used to delete a firmware version
- Requires admin authentication
- Parameters: `id` (firmware ID)

### Database Structure

The firmware data is stored in the `firmware` table with the following structure:

```sql
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
```

### Storage Structure

Firmware binary files are stored in Supabase Storage with the following path structure:

`firmware/v{version}_{deviceModel}.bin`

## Client Implementation

A sample ESP32 implementation is provided in `examples/firmware_update_client.ino`. This demonstrates:

1. Checking for updates
2. Downloading firmware
3. Verifying MD5 hash
4. Installing the update

## Testing Updates

To test the firmware update system:

1. Upload an initial firmware (e.g., v1.0.0)
2. Deploy it to the device
3. Upload a newer firmware (e.g., v1.0.1)
4. The device should detect and install the update on its next check

## Troubleshooting

### Common Issues

1. **Update Not Found**: Ensure the newer firmware has a higher version number and is for the correct device model.
2. **Download Failures**: Check that Supabase storage is properly configured and accessible.
3. **Authentication Errors**: Verify that the device has the correct authentication token.
4. **MD5 Verification Failure**: The downloaded firmware may be corrupted or incomplete.

### Logs

- Server-side logs are available in the admin dashboard
- Device update logs are printed to the serial console during the update process

## Future Improvements

- Staged rollouts to limit update distribution
- Firmware version dependencies to enforce update paths
- Rollback support for failed updates
- Firmware update scheduling during off-peak hours 