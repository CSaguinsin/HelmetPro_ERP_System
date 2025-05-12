"use client";
import { useState, useEffect } from "react";
import { sendStatus } from "@/lib/hardwareApi";

// Define common status codes for easy selection
const commonStatusCodes = [
  { code: 100, description: "Machine idle" },
  { code: 101, description: "Cleaning in progress" },
  { code: 102, description: "Maintenance mode" },
  { code: 200, description: "Machine starting up" },
  { code: 201, description: "Machine shutting down" },
  { code: 300, description: "Low supply warning" },
  { code: 400, description: "General error" },
  { code: 500, description: "Critical system error" }
];

export default function SendStatus() {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [storedDeviceId, setStoredDeviceId] = useState<string | null>(null);

  // Check for stored device info on component mount
  useEffect(() => {
    try {
      const deviceInfoStr = localStorage.getItem('device_info');
      if (deviceInfoStr) {
        const deviceInfo = JSON.parse(deviceInfoStr);
        if (deviceInfo.device_id) {
          setStoredDeviceId(deviceInfo.device_id);
          console.log("Using device ID:", deviceInfo.device_id);
        }
      }
    } catch (error) {
      console.error("Failed to parse device info:", error);
    }
  }, []);

  // Handle preset status code selection
  const handleSelectCode = (code: number, description: string) => {
    setCode(code.toString());
    setDescription(description);
  };

  const handleSend = async () => {
    if (!code || isNaN(Number(code))) {
      setMessage("Please enter a valid status code");
      setIsSuccess(false);
      return;
    }

    if (!description.trim()) {
      setMessage("Please enter a status description");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage(null);
    
    try {
      // Determine which authentication method to use
      const options: { deviceToken?: string; deviceId?: string } = {};
      
      // Use provided access token if available
      if (accessToken) {
        options.deviceToken = accessToken;
      }
      
      // Use manually entered device ID if available, otherwise use stored one
      if (deviceId) {
        options.deviceId = deviceId;
      } else if (storedDeviceId && !accessToken) {
        // Only use stored device ID if we don't have a token
        options.deviceId = storedDeviceId;
      }
      
      const res = await sendStatus(Number(code), description, 
        Object.keys(options).length > 0 ? options : undefined);
      
      setIsLoading(false);
      
      if (res.error) {
        setMessage(res.error);
        setIsSuccess(false);
      } else {
        // Check if this was a test mode response
        const responseMessage = res.data && typeof res.data === 'object' && 'message' in res.data 
          ? String(res.data.message) 
          : '';
          
        if (responseMessage.includes('TEST MODE')) {
          setMessage("Status sent successfully (TEST MODE)");
          setIsTestMode(true);
        } else {
          setMessage("Status sent successfully");
          setIsTestMode(false);
        }
        setIsSuccess(true);
        setCode("");
        setDescription("");
      }
    } catch (error) {
      setIsLoading(false);
      setMessage(error instanceof Error ? error.message : "Failed to send status");
      setIsSuccess(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-medium mb-3">Send Status Update</h3>
      
      {storedDeviceId && (
        <div className="text-sm text-green-600 mb-2">
          Using device ID: {storedDeviceId}
        </div>
      )}
      
      {/* Quick status selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Select Status:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {commonStatusCodes.map((status) => (
            <button
              key={status.code}
              type="button"
              onClick={() => handleSelectCode(status.code, status.description)}
              className={`text-xs p-2 rounded border ${
                Number(code) === status.code
                  ? 'bg-blue-100 border-blue-500 text-blue-800'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
              }`}
            >
              <div className="font-medium">{status.code}</div>
              <div className="truncate">{status.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="statusCode" className="block text-sm font-medium text-gray-700 mb-1">
              Status Code
            </label>
            <input
              id="statusCode"
              type="number"
              placeholder="Enter status code"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="statusDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id="statusDescription"
              type="text"
              placeholder="Enter status description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Advanced settings toggle */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {showAdvanced ? '− Hide Advanced Settings' : '+ Show Advanced Settings'}
          </button>
        </div>
        
        {/* Advanced settings */}
        {showAdvanced && (
          <div className="mt-2 p-3 border rounded bg-gray-50">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700 mb-1">
                  Device Access Token (Optional)
                </label>
                <input
                  id="accessToken"
                  type="text"
                  placeholder="Enter access token for direct authentication"
                  value={accessToken}
                  onChange={e => setAccessToken(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  If provided, this token will be used for direct authentication with the API.
                </p>
              </div>
              
              <div>
                <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Device ID (Optional)
                </label>
                <input
                  id="deviceId"
                  type="text"
                  placeholder="Enter device ID for direct device identification"
                  value={deviceId}
                  onChange={e => setDeviceId(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Override the automatically detected device ID if needed.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-2">
          <button 
            onClick={handleSend} 
            className={`px-4 py-2 rounded text-white w-full ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Status Update'}
          </button>
        </div>
        
        {message && (
          <div className={`mt-2 text-sm p-2 rounded ${isSuccess 
            ? (isTestMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800') 
            : 'bg-red-100 text-red-800'}`}>
            {message}
            {isTestMode && (
              <p className="mt-1 text-xs">Note: Using test mode because you are not authenticated as a device.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 