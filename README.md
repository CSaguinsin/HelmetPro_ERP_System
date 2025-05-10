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

5. Access the dashboard in your browser at:
   ```
   http://localhost:3000
   ```

## Contributing
Contributions are welcome! If you'd like to improve this project, please fork the repository and submit a pull request.

## License & Copyright
This project is licensed under the [MIT License](LICENSE).

**Copyright © Craftora.**

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



