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
  
  const token = localStorage.getItem('auth_token') || '';
  if (!token) return '';
  
  // For API calls, we need to include the user_client_id in the request headers
  // if the token is our custom fallback token, extract the user_client_id
  if (!token.includes('.')) {
    try {
      // Try to parse as our fallback token
      const tokenData = JSON.parse(atob(token));
      // Add user_client_id to a separate localStorage item for API calls
      if (tokenData.user_client_id) {
        localStorage.setItem('api_user_client_id', tokenData.user_client_id);
      }
    } catch (e) {
      console.warn("Failed to parse fallback token", e);
    }
  }
  
  return token;
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

    // Create headers with the correct authorization format
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use different auth header format based on token type
    if (token.includes('.')) {
      // JWT token from Supabase - use Bearer format
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Our fallback token - use custom header
      headers['access_token'] = token;
      
      // Also add user_client_id for additional verification
      const userClientId = localStorage.getItem('api_user_client_id') || 
                          localStorage.getItem('user_client_id');
      if (userClientId) {
        headers['x-user-client-id'] = userClientId;
      }
      
      // Add device info if available
      const deviceInfo = localStorage.getItem('device_info');
      if (deviceInfo) {
        headers['x-device-info'] = deviceInfo;
      }
    }

    const response = await fetch(`/api/hardware/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await response.json();
    
    // Special handling for the "No device associated" error
    if (!response.ok) {
      if (response.status === 404 && result.error && result.error.includes('No device associated with this user')) {
        // For device-details endpoint, return empty data instead of throwing
        if (endpoint.startsWith('device-details')) {
          return { data: undefined } as ApiResponse<T>;
        }
      }
      throw new Error(result.error || 'API call failed');
    }
    
    // Transform device data from device-details endpoint to match the expected structure
    if (endpoint.startsWith('device-details') && result.device) {
      // Map the API response to our DeviceDetails interface
      const transformedData = {
        device_id: parseInt(result.device.id) || 0,
        device_name: result.device.machine_id || "Unknown Device",
        device_status: result.device.status === "active" ? "Enable" : "Disable",
        device_type: result.device.model || "HelmetPro Standard",
        status: result.device.status || "active",
        protocol_type: "Standard",
        maturity_time: "",
        department: "",
        customer_name: "",
        device_reg_id: result.device.machine_id || "Unknown"
      };
      
      return { data: transformedData as unknown as T };
    }
    
    return result;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};

// Device Details API
export const getDeviceDetails = async (deviceId?: string | number): Promise<ApiResponse<DeviceDetails>> => {
  let endpoint = 'device-details';
  if (deviceId) {
    endpoint += `?device_id=${deviceId}`;
  }
  return apiCall<DeviceDetails>(endpoint);
};

// Assets API
export const getAssets = async (): Promise<ApiResponse<MediaFile[]>> => {
  try {
    // Get auth token
    const token = getAuthToken();
    if (!token) return { error: 'No authentication token found' };
    
    // Create headers with the correct authorization format
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use different auth header format based on token type
    if (token.includes('.')) {
      // JWT token from Supabase - use Bearer format
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Our fallback token - use custom header
      headers['access_token'] = token;
    }
    
    // Add user_client_id for additional verification
    const userClientId = localStorage.getItem('api_user_client_id') || 
                         localStorage.getItem('user_client_id');
    if (userClientId) {
      headers['x-user-client-id'] = userClientId;
    }
    
    // Add device info if available
    const deviceInfoStr = localStorage.getItem('device_info');
    if (deviceInfoStr) {
      try {
        const deviceInfo = JSON.parse(deviceInfoStr);
        headers['x-device-info'] = deviceInfoStr;
        
        // Set up endpoint with deviceId as query parameter
        const endpoint = `assets?deviceId=${deviceInfo.device_id}`;
        
        // Make the request
        const response = await fetch(`/api/hardware/${endpoint}`, {
          method: 'GET',
          headers,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Asset fetch error:', errorData);
          return { error: errorData.error || `Failed to fetch assets: ${response.status}` };
        }
        
        const result = await response.json();
        
        // Handle both old and new response formats
        if (result.data) {
          // New format - direct data array
          return { data: Array.isArray(result.data) ? result.data as MediaFile[] : [] };
        } else if (result.assets) {
          // Old format - assets array
          const mappedAssets = result.assets.map((asset: { id: string; type: string; name: string; url: string }) => ({
            id: asset.id,
            file_type: asset.type,
            file_name: asset.name,
            file_url: asset.url
          }));
          return { data: mappedAssets };
        }
        
        // Fallback - empty array
        return { data: [] };
      } catch (parseError) {
        console.error('Failed to parse device info:', parseError);
        return { error: 'Invalid device info format' };
      }
    } else {
      // No device info available
      return { data: [] };
    }
  } catch (error) {
    console.error('Error fetching assets:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch assets' };
  }
};

export const uploadAsset = async (formData: FormData): Promise<ApiResponse<MediaFile>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  try {
    // Create headers with the correct authorization format
    const headers: Record<string, string> = {};
    
    // Use different auth header format based on token type
    if (token.includes('.')) {
      // JWT token from Supabase - use Bearer format
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Our fallback token - use custom header
      headers['access_token'] = token;
      
      // Also add user_client_id for additional verification
      const userClientId = localStorage.getItem('api_user_client_id') || 
                          localStorage.getItem('user_client_id');
      if (userClientId) {
        headers['x-user-client-id'] = userClientId;
      }
      
      // Add device info if available
      const deviceInfo = localStorage.getItem('device_info');
      if (deviceInfo) {
        headers['x-device-info'] = deviceInfo;
      }
    }

    // Use the standard hardware/assets endpoint as specified in requirements
    const response = await fetch('/api/hardware/assets', {
      method: 'POST',
      headers,
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

// Firmware API interface
export interface FirmwareInfo {
  version: string;
  bin_url: string;
  md5_hash: string;
  release_notes: string;
}

// Firmware API
export const getFirmware = async (currentVersion?: string): Promise<ApiResponse<FirmwareInfo>> => {
  let endpoint = 'firmware';
  if (currentVersion) {
    endpoint += `?version=${encodeURIComponent(currentVersion)}`;
  }
  return apiCall<FirmwareInfo>(endpoint);
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