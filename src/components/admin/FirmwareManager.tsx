import React, { useState, useEffect, useCallback } from 'react';

interface Firmware {
  id: number;
  version: string;
  device_model: string;
  file_path: string;
  md5_hash: string;
  release_notes?: string;
  release_date: string;
}

const FirmwareManager: React.FC = () => {
  const [firmwareList, setFirmwareList] = useState<Firmware[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceModels] = useState<string[]>([
    'HelmetPro Standard',
    'HelmetPro X2',
    'HelmetPro Mini'
  ]);
  
  // Form states
  const [version, setVersion] = useState('');
  const [deviceModel, setDeviceModel] = useState(deviceModels[0]);
  const [file, setFile] = useState<File | null>(null);
  const [releaseNotes, setReleaseNotes] = useState('');
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
  );
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Get auth token from localStorage
  const getAuthToken = useCallback((): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('auth_token') || '';
  }, []);

  // Create headers with auth token
  const getAuthHeaders = useCallback((): HeadersInit => {
    const token = getAuthToken();
    if (!token) return {};
    
    // Return appropriate headers based on token type
    if (token.includes('.')) {
      // JWT token (Supabase)
      return {
        'Authorization': `Bearer ${token}`
      };
    } else {
      // Custom token
      return {
        'access_token': token
      };
    }
  }, [getAuthToken]);

  // Fetch firmware list from API
  const fetchFirmwareList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/firmware', {
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch firmware list');
      }
      
      setFirmwareList(data.firmwareList || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching firmware list:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch firmware list on component mount
  useEffect(() => {
    fetchFirmwareList();
  }, [fetchFirmwareList]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus(null);
    
    if (!file) {
      setUploadStatus({ success: false, message: 'Please select a firmware file' });
      return;
    }
    
    if (!version) {
      setUploadStatus({ success: false, message: 'Please enter a version number' });
      return;
    }
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('version', version);
      formData.append('deviceModel', deviceModel);
      formData.append('releaseNotes', releaseNotes);
      formData.append('releaseDate', releaseDate);
      
      // Upload firmware
      const response = await fetch('/api/admin/firmware', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload firmware');
      }
      
      // Reset form
      setFile(null);
      setVersion('');
      setReleaseNotes('');
      setReleaseDate(new Date().toISOString().split('T')[0]);
      
      // Set success status
      setUploadStatus({ 
        success: true, 
        message: `Firmware v${result.data.version} uploaded successfully` 
      });
      
      // Refresh firmware list
      fetchFirmwareList();
    } catch (err) {
      setUploadStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to upload firmware'
      });
      console.error('Error uploading firmware:', err);
    }
  };

  // Handle firmware deletion
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this firmware version? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/firmware?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete firmware');
      }
      
      // Refresh firmware list
      fetchFirmwareList();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error deleting firmware:', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Firmware Management</h2>
      
      {/* Upload Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-medium mb-4">Upload New Firmware</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version Number
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 1.0.0"
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Model
              </label>
              <select
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              >
                {deviceModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firmware File (.bin)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".bin"
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                required
              />
              <span className="text-xs text-gray-500">
                Only .bin files are supported
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Release Date
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Release Notes
            </label>
            <textarea
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              placeholder="Enter release notes (optional)"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-300"
            >
              Upload Firmware
            </button>
          </div>
        </form>
        
        {uploadStatus && (
          <div className={`mt-4 p-3 rounded ${uploadStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {uploadStatus.message}
          </div>
        )}
      </div>
      
      {/* Firmware List */}
      <div>
        <h3 className="text-lg font-medium mb-4">Firmware Versions</h3>
        {isLoading ? (
          <p className="text-gray-500">Loading firmware versions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : firmwareList.length === 0 ? (
          <p className="text-gray-500">No firmware versions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MD5 Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {firmwareList.map((firmware) => (
                  <tr key={firmware.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {firmware.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {firmware.device_model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(firmware.release_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-mono text-xs">{firmware.md5_hash.substring(0, 10)}...</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDelete(firmware.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirmwareManager; 