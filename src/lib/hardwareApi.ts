// Types
export interface DeviceDetails {
  device_id: number;
  device_name: string;
  device_status: "Disable" | "Enable" | "Maintenance";
  device_type: string;
  status: string;
  protocol_type: string;
  maturity_time: string;
  department: string;
  customer_name: string;
  device_reg_id: string;
}

export interface MediaFile {
  file_type: string;
  file_url: string;
  file_name: string;
}

export interface DeviceSettings {
  required_payment_amount: number;
  payment_methods: string[];
  machine_id: string;
  smoke_duration: number;
  smoke_repeat_every: number;
  uv_light_duration: number;
  blower_drying_time: number;
  blower_drying_repeat_every: number;
  open_door_after: number;
  timezone: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Helper function to get auth token
const getAuthToken = (): string => {
  if (typeof window === "undefined") return '';
  return localStorage.getItem('auth_token') || '';
};

// Helper function to make API calls
const apiCall = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: Record<string, unknown>
): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`/api/hardware/${endpoint}`, {
      method,
      headers: {
        'access_token': token,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'API call failed');
    return result;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};

// Device Details API
export const getDeviceDetails = async (): Promise<ApiResponse<DeviceDetails>> => {
  return apiCall<DeviceDetails>('device-details');
};

// Assets API
export const getAssets = async (): Promise<ApiResponse<MediaFile[]>> => {
  return apiCall<MediaFile[]>('assets');
};

export const uploadAsset = async (formData: FormData): Promise<ApiResponse<MediaFile>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch('/api/hardware/assets', {
      method: 'POST',
      headers: { 'access_token': token },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Upload failed');
    return result;
  } catch (error) {
    console.error('Asset upload failed:', error);
    return { error: error instanceof Error ? error.message : 'Upload failed' };
  }
};

// Firmware API
export const getFirmware = async (): Promise<ApiResponse<{ url: string }>> => {
  return apiCall<{ url: string }>('firmware');
};

// Settings API
export const getSettings = async (deviceId?: string | number): Promise<ApiResponse<DeviceSettings>> => {
  let endpoint = 'settings';
  if (deviceId) {
    endpoint += `?deviceId=${deviceId}`;
  }
  return apiCall<DeviceSettings>(endpoint);
};

export const updateSettings = async (settings: Partial<DeviceSettings>, deviceId?: string | number): Promise<ApiResponse<DeviceSettings>> => {
  let endpoint = 'settings';
  if (deviceId) {
    endpoint += `?deviceId=${deviceId}`;
  }
  return apiCall<DeviceSettings>(endpoint, 'PUT', settings);
};

// Transaction API
export const sendTransaction = async (machineId: string, amount: number): Promise<ApiResponse<{ success: boolean }>> => {
  return apiCall<{ success: boolean }>('transaction', 'POST', { machineId, amount });
};

// Status API
export const sendStatus = async (code: number, description: string): Promise<ApiResponse<{ success: boolean }>> => {
  return apiCall<{ success: boolean }>('status', 'POST', { code, description });
};

// Feedback API
export const sendFeedback = async (machineId: string, rating: number): Promise<ApiResponse<{ success: boolean }>> => {
  return apiCall<{ success: boolean }>('feedback', 'POST', { machineId, rating });
}; 