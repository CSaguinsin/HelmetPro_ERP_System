# Client-Specific Machine Monitoring and Earnings Dashboard

## Overview
This project aims to develop a **Client-Specific Machine Monitoring and Earnings Dashboard**, providing businesses with a seamless way to track and manage their machine operations. Each client will have a secure admin account, enabling them to monitor the real-time status of their machines and track earnings effortlessly.

The system features an intuitive dashboard with a well-designed UX and UI, ensuring a smooth and engaging user experience. Clients will gain instant access to critical machine data, including operational status, performance metrics, and financial insights, allowing for better decision-making and increased efficiency.

## Key Features
- **Admin Accounts for Clients** – Secure, personalized access to their machine data.
- **Machine Status Monitoring** – Real-time updates on uptime, downtime, and potential issues.
- **Earnings Tracking** – A clear financial overview of revenue per machine.
- **User-Friendly Interface** – A sleek, easy-to-navigate design.
- **Secure & Scalable Infrastructure** – Ensuring data protection and future growth potential.

By implementing this system, businesses will benefit from improved operational oversight, enhanced financial transparency, and greater efficiency, ultimately leading to:
- Reduced downtime
- Optimized machine utilization
- Higher profitability

## Project Background
In industries that rely on machine operations, real-time monitoring and financial tracking are essential for maintaining efficiency, maximizing productivity, and ensuring profitability. Many businesses struggle with manual tracking methods or outdated systems that provide limited visibility into machine performance and earnings. 

Without a centralized solution, clients face challenges such as:
- Unexpected downtime
- Revenue losses
- Inefficient resource allocation

To address these challenges, this project introduces a **Client-Specific Machine Monitoring and Earnings Dashboard**—a comprehensive solution that enables clients to securely track, manage, and optimize their machine operations. By integrating real-time machine status updates and financial insights into a user-friendly interface, this system empowers businesses to:
- Make data-driven decisions
- Reduce downtime
- Enhance overall profitability

## Why This Project Matters
The development of this solution aligns with the growing demand for smart, data-driven monitoring tools that provide instant access to operational and financial metrics. As businesses continue to embrace digital transformation, having a dedicated, secure, and efficient monitoring system will become a key factor in streamlining operations and improving business outcomes.

This project bridges the gap between operational efficiency and financial transparency, ensuring that clients have complete control over their assets with minimal manual intervention. Through this innovative system, businesses will:
- Optimize machine utilization
- Improve decision-making
- Drive sustainable growth

## Tech Stack
- **Frontend:** Next.js, TailwindCSS
- **Backend:** Supabase
- **Database:** Supabase PostgreSQL
- **Infrastructure:** Docker / Raspberry Pi (if applicable)

## Getting Started
To set up and run the project locally:

1. Clone this repository:
   ```sh
   git clone https://github.com/yourusername/machine-monitoring-dashboard.git
   cd machine-monitoring-dashboard
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up Supabase:
   - Create a Supabase project.
   - Configure the database schema.
   - Set up authentication and storage.

4. Run the development server:
   ```sh
   npm run dev
   ```

5. Access the dashboard in your browser ats:
   ```
   http://localhost:3000
   ```

## Contributing
Contributions are welcome! If you'd like to improve this project, please fork the repository and submit a pull request.

## License & Copyright
This project is licensed under the [MIT License](LICENSE).



# HelmetPro ERP - API & Frontend Integration Guide

## Overview
This project now features a fully integrated, secure, and modular device management system, including:
- Device settings management (view per device)
- Secure, authenticated file uploads via backend API
- Transaction, status, and feedback UI for each device
- Centralized API utility for all hardware-related calls

---

## Features

### 1. Device Settings Page
- Each device in the device list has a **Settings** button.
- Navigates to `/dashboard/device-settings/[deviceId]`.
- Fetches and displays device settings from the backend API.
- (Ready for future editing support.)

### 2. File Upload API Integration
- All media uploads (logo, video, images) are POSTed to `/api/hardware/assets` using `FormData` and the `access_token` header.
- No direct client-side Supabase uploads; all uploads are authenticated and routed through the backend.
- The backend can validate/process uploads and return file URLs.

### 3. Transaction, Status, and Feedback UI
- For each device, the UI renders:
  - `SendTransaction` (send a transaction to the backend)
  - `SendStatus` (send a status update)
  - `SendFeedback` (send a rating and comments)
- All use the centralized API utility and are authenticated.

### 4. Centralized API Utility
- All hardware API calls are made via `src/lib/hardwareApi.ts`.
- Ensures correct headers, payloads, and error handling.

---

## Developer Usage

### Device Settings
- Go to the device list page.
- Click the **Settings** button for any device to view its settings.
- Settings are fetched from `/api/hardware/settings`.

### File Uploads
- All uploads in the media upload component are sent to `/api/hardware/assets`.
- The backend must accept `FormData` and the `access_token` header.
- The frontend expects a JSON response with the file URL or error.

### Transaction, Status, Feedback
- Components are rendered for each device in the device list.
- All API calls are authenticated using the token from `localStorage`.

### Adding New API Calls
- Use `src/lib/hardwareApi.ts` for all new hardware-related API calls.
- Always include the `access_token` header for authentication.

---

## Best Practices
- All API calls are authenticated and centralized.
- UI is modular and maintainable.
- Linter and type errors are fixed.
- Ready for production and future extensibility.

---

## Next Steps (Optional)
- To make device settings editable, add a form and PATCH/PUT logic to the settings page.
- To further customize uploads or backend validation, update the backend API accordingly.

---

## Device Settings Implementation

The system now features a complete device settings management module that allows viewing and editing of all device configuration parameters:

### Features

- **View and Edit Device Settings**: Full support for viewing and editing all device settings
- **Field-Validated Form**: Form with validation for all settings fields
- **Payment Method Selection**: Support for multiple payment methods (Coin Slot, Bill Acceptor, Card Only)
- **Tabbed Interface**: Easy switching between view and edit modes
- **API Integration**: Full integration with backend API for retrieving and updating settings

### Settings Parameters

The device settings module supports all required parameters:

| Parameter | Description | Type |
|-----------|-------------|------|
| Required Payment Amount | Payment required to use the device | Number |
| Payment Methods | Supported payment methods | Array of Strings |
| Machine ID | Unique identifier for the machine | String |
| Smoke Duration | Duration of smoke cleaning in seconds | Number |
| Smoke Repeat Every | Interval between smoke cleaning in seconds | Number |
| UV Light Duration | Duration of UV light cleaning in seconds | Number |
| Blower/Drying Time | Duration of blower operation in seconds | Number |
| Blower/Drying Repeat Every | Interval between blower cycles in seconds | Number |
| Open Door After | Time to automatically open door in seconds | Number |
| Machine Timezone | Timezone for the device | String |

### Technical Implementation

- Backend API routes (`GET`, `POST`, and `PUT`) with proper validation
- Centralized API utility functions for settings operations
- Form validation using Zod schema
- Proper error handling and user feedback
- Support for admin operations through device ID parameter

### How to Use

1. Navigate to the device list page
2. Click the "Settings" button for any device
3. View current device settings in the "View Settings" tab
4. Click "Edit Settings" to modify parameters
5. Make changes and click "Save Settings" to update

---

## Firmware Management System

The system now includes a complete firmware management system for over-the-air (OTA) updates of connected devices:

### Features

- **Firmware Upload & Management**: Admin interface for uploading and managing firmware versions
- **Device Model Targeting**: Firmware can be targeted to specific device models
- **Version Control**: Automatic version comparison to serve appropriate updates
- **OTA Update API**: RESTful API endpoints for devices to check for and download updates
- **Secure Downloads**: Signed URLs with expiration for secure firmware distribution
- **MD5 Verification**: MD5 hash provided for firmware integrity verification

### Technical Implementation

- **Admin Dashboard**: Available at `/dashboard/firmware` with upload and management UI
- **Storage**: Firmware files stored in Supabase storage bucket with proper permissions
- **Database**: Firmware metadata stored in relational database with version tracking
- **API Endpoints**:
  - `/api/hardware/firmware` (GET/POST) - For devices to check and download updates
  - `/api/admin/firmware` (GET/POST/DELETE) - For administrators to manage firmware

### Security Features

- **Role-Based Access Control**: Only admin users can upload and manage firmware
- **Authentication Required**: All firmware operations require proper authentication
- **File Validation**: Binary files are validated before storage
- **Version Comparison**: Devices only receive newer firmware versions

### How to Test

A comprehensive test script (`scripts/test-firmware.js`) is included to verify:
- Firmware upload functionality
- Firmware listing and retrieval
- OTA update delivery to devices
- Firmware binary download

### How to Use

1. **For Administrators**:
   - Navigate to Dashboard → System Management → Firmware Management
   - Upload new firmware files (.bin) with version number and device model
   - View and manage existing firmware versions

2. **For Devices**:
   - Devices query `/api/hardware/firmware?version=current_version` with auth token
   - If newer firmware is available, response includes download URL and MD5 hash

---

## Sales Monitoring Module

The system now includes a comprehensive Sales Monitoring Module that allows tracking and managing transactions from connected devices:

### Features

- **Transaction Management**: View and send transactions to connected devices
- **Device-Specific Transactions**: Transactions are associated with specific devices
- **Real-Time Updates**: Send transactions and receive immediate confirmation
- **Secure API**: All transaction operations require proper authentication
- **User-Friendly Interface**: Clean UI for monitoring and initiating transactions
- **Total Sales Tracking**: View total sales amount per device
- **Payment Method Tracking**: Track different payment methods used

### Technical Implementation

- **Dashboard Page**: Available at `/dashboard/sales-monitoring` with full sidebar integration
- **Device Selection**: User-specific device list with status indicators
- **Device Detail Page**: Device-specific transaction history at `/dashboard/sales-monitoring/[deviceId]`
- **API Endpoints**: 
  - `POST /api/hardware/transaction` - Send new transactions with `{ machineId, amount }`
  - `GET /api/hardware/transaction` - Retrieve transaction history
- **Multiple Authentication Methods**: Supports token-based, direct device ID, and test mode

### How to Use

1. Navigate to Dashboard → System Management → Sales Monitoring
2. View list of devices associated with your account
3. Click on a device to view its transaction history
4. Use the "Send Transaction" tab to initiate a new transaction
5. Advanced options available for direct device authentication

---

## Machine Status & Notifications Module

The system now includes a complete Machine Status & Notifications Module that enables real-time status monitoring and notifications management:

### Features

- **Status Monitoring**: View current status and history of connected devices
- **Status Updates**: Send status updates to devices with standardized codes
- **Notifications System**: Automatic notifications for error conditions
- **Status Tracking**: Historical record of all status changes
- **User-Friendly Interface**: Intuitive UI for status monitoring and management

### Technical Implementation

- **Dashboard Page**: Available at `/dashboard/machine-status` with full sidebar integration
- **Device Selection**: User-specific device list with status indicators
- **Device Detail Page**: Device-specific status history at `/dashboard/machine-status/[deviceId]`
- **API Endpoints**:
  - `POST /api/hardware/status` - Send status updates with `{ code, description }`
  - `GET /api/hardware/status` - Retrieve status history
- **Status Codes**: Standardized codes for different device states (e.g., idle, active, error)
- **Automatic Notifications**: System generates notifications for error status codes

### Status Code Reference

| Code Range | Description          | Example                      |
|------------|----------------------|------------------------------|
| 100-199    | Normal operation     | 100: Machine idle            |
| 200-299    | Transitional states  | 200: Machine starting up     |
| 300-399    | Warnings             | 300: Low supply warning      |
| 400-499    | Errors               | 400: General error           |
| 500-599    | Critical errors      | 500: Critical system error   |

### How to Use

1. Navigate to Dashboard → System Management → Machine Status & Notifications
2. View list of devices associated with your account
3. Click on a device to view its status history and notifications
4. Use the "Send Status Update" tab to send a new status
5. Receive and manage notifications for error conditions

✅ **Implementation Status**: Fully implemented and tested with database integration.

---



