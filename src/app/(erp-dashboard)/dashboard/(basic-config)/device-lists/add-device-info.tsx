'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/lib/auth-context';

interface AddDeviceInfoProps {
  onClose: () => void;
  onDeviceAdded?: () => void;
}

export default function AddDeviceInfo({ onClose, onDeviceAdded }: AddDeviceInfoProps) {
  const { user } = useAuth();
  const [deviceUUID, setDeviceUUID] = useState('');
  const [userClientId, setUserClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchOrCreateUserClientId = async () => {
      if (!user?.id) {
        console.error('No authenticated user found.');
        return;
      }

      try {
        setLoading(true);

        // Check localStorage first for an existing user_client_id
        const storedClientId = localStorage.getItem('user_client_id');
        if (storedClientId) {
          console.log('Found user_client_id in localStorage:', storedClientId);
          setUserClientId(storedClientId);
          setLoading(false);
          setIsInitialized(true);
          return;
        }

        console.log('Looking for user_client with erp_user_id:', user.id);

        // Try multiple approaches to find the user_client
        let userData = null;

        // First, try with erp_user_id
        const { data: dataByErpId, error: errorByErpId } = await supabase
          .from('user_clients')
          .select('*')
          .eq('erp_user_id', user.id)
          .maybeSingle();

        if (!errorByErpId && dataByErpId) {
          userData = dataByErpId;
          console.log('Found user_client by erp_user_id:', userData);
        } else {
          console.log('No user_client found by erp_user_id, checking by email');

          // If not found, try by email
          if (user.email) {
            const { data: dataByEmail, error: errorByEmail } = await supabase
              .from('user_clients')
              .select('*')
              .eq('email', user.email)
              .maybeSingle();

            if (!errorByEmail && dataByEmail) {
              userData = dataByEmail;
              console.log('Found user_client by email:', userData);
            }
          }
        }

        if (userData) {
          // We found a user_client record, use it
          setUserClientId(userData.user_client_id);
          localStorage.setItem('user_client_id', userData.user_client_id);
          console.log('Using existing user_client_id:', userData.user_client_id);
        } else {
          console.warn('No user_client_id found for the authenticated user.');

          // Create a new user_client_id since one doesn't exist
          const newUserClientId = uuidv4();
          console.log('Creating new user_client_id:', newUserClientId);

          // Create a user_client record with the exact fields from the table
          const userClientData = {
            user_client_id: newUserClientId,
            erp_user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            email: user.email || '',
            password: 'temporary_' + Math.random().toString(36).substring(2, 10), // Generate a temporary password
          };

          console.log('Attempting to insert user_client data:', userClientData);

          const { error: insertError } = await supabase
            .from('user_clients')
            .insert([userClientData]);

          if (insertError) {
            console.error('Error creating user_client_id:', insertError);
            console.error('Error details:', JSON.stringify(insertError, null, 2));
            toast.error('Failed to create user client ID');

            // If we get a duplicate key error, the user already has a client ID but we couldn't find it
            if (
              insertError.code === '23505' &&
              insertError.message.includes('user_clients_erp_user_id_key')
            ) {
              console.log(
                'Looks like user already has a client ID. Fetching all records to find it.'
              );

              // Try a direct query to get all user_clients and find the record
              const { data: allData } = await supabase.from('user_clients').select('*');
              console.log('All user_clients:', allData);

              // If we find any records, use the first one for simplicity
              if (allData && allData.length > 0) {
                // Look for a match by erp_user_id
                const matchingClient = allData.find(
                  (client) => client.erp_user_id === user.id
                );
                if (matchingClient) {
                  console.log('Found matching user_client:', matchingClient);
                  setUserClientId(matchingClient.user_client_id);
                  localStorage.setItem('user_client_id', matchingClient.user_client_id);
                }
              }
            }
          } else {
            // Save to localStorage for future use
            localStorage.setItem('user_client_id', newUserClientId);
            setUserClientId(newUserClientId);
            toast.success('Created new user client ID');
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    fetchOrCreateUserClientId();
  }, [user]);

  const generateUUID = () => {
    const newUUID = uuidv4();
    setDeviceUUID(newUUID);
    toast.success('UUID Generated!');
  };

  const saveDevice = async () => {
    // Log button click to verify it's being triggered
    console.log('Save button clicked');

    if (!deviceUUID) {
      toast.error('Generate a UUID first!');
      return;
    }

    try {
      setLoading(true);

      // Get or generate a client ID
      let clientId = userClientId;

      if (!clientId) {
        // If we don't have a user_client_id, try to get it from localStorage
        clientId = localStorage.getItem('user_client_id');

        if (clientId) {
          console.log('Using user_client_id from localStorage:', clientId);
        } else {
          // As a last resort, generate a temporary client ID and create a record in the database
          const tempClientId = uuidv4();
          const tempUserId = uuidv4();

          console.log('Generated temporary IDs:', {
            clientId: tempClientId,
            userId: tempUserId,
          });

          // Create a user_client record in the database with the exact fields
          try {
            const userClientData = {
              user_client_id: tempClientId,
              erp_user_id: tempUserId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              email: user?.email || 'temp@user.com',
              password: 'temporary_' + Math.random().toString(36).substring(2, 10),
            };

            const { error: createError } = await supabase
              .from('user_clients')
              .insert([userClientData]);

            if (createError) {
              console.error('Error creating temporary user_client:', createError);
              console.error('Error details:', JSON.stringify(createError, null, 2));
            } else {
              console.log('Created temporary user_client record');
            }
          } catch (createError) {
            console.error('Exception creating temporary user_client:', createError);
          }

          // Use the temporary ID regardless of whether the database insert succeeded
          clientId = tempClientId;
          console.log('Using generated temporary user_client_id:', clientId);
          localStorage.setItem('user_client_id', clientId);

          // If we know user's erp_user_id, store the mapping for future reference
          if (user?.id) {
            localStorage.setItem(
              'erp_user_to_client_id_mapping',
              JSON.stringify({
                erp_user_id: user.id,
                user_client_id: clientId,
              })
            );
          }

          toast.success('Created temporary user client ID');
        }
      }

      console.log('Starting device save process');
      console.log('UUID:', deviceUUID);
      console.log('User Client ID:', clientId);
      console.log('User:', user);

      const randomDeviceId = Math.floor(Math.random() * 99999).toString();
      const randomDeviceId2 = Math.floor(Math.random() * 78787).toString();

      // 1. Create device data
      const deviceData = {
        device_id: deviceUUID,
        user_client_id: clientId,
        device_name: `MACHINE - ${randomDeviceId}`,
        device_status: 'active',
        device_type: 'mobile',
        protocol_type: 'TCP',
        customer_nan: 'default',
        device_reg_id: `DEVICE-${randomDeviceId2}`,
        vending_machine_ip: '0.0.0.0',
        media_configured: false,
        erp_client_id: clientId,
      };

      console.log('Device data to insert:', deviceData);

      // 2. Insert device
      const { error: deviceError } = await supabase
        .from('device_list')
        .insert([deviceData]);

      if (deviceError) {
        console.error('Error inserting device:', deviceError);
        console.error('Error details:', JSON.stringify(deviceError, null, 2));
        toast.error(`Error saving device: ${deviceError.message}`);
        return;
      }

      console.log('Device inserted successfully!');

      // 3. Create default device settings
      const defaultSettings = {
        device_id: deviceUUID,
        required_payment_amount: 50.0,
        payment_methods: ['coin_slot'],
        machine_id: deviceData.device_reg_id,
        smoke_duration: 30,
        smoke_repeat_every: 5,
        uv_light_duration: 30,
        blower_drying_time: 60,
        blower_drying_repeat_every: 10,
        open_door_after: 120,
        timezone: 'Asia/Manila',
        updated_by: user?.id || clientId,
      };

      console.log('Creating default device settings:', defaultSettings);

      const { error: settingsError } = await supabase
        .from('device_settings')
        .insert([defaultSettings]);

      if (settingsError) {
        console.error('Error creating default settings:', settingsError);
        console.error('Error details:', JSON.stringify(settingsError, null, 2));
        // Don't return, as we still want to complete the device creation process
      } else {
        console.log('Default device settings created successfully!');
      }

      // Store the relationship in localStorage for quick reference
      localStorage.setItem('device_id', deviceUUID);
      localStorage.setItem(
        'user_client_device_mapping',
        JSON.stringify({
          user_client_id: clientId,
          device_id: deviceUUID,
          created_at: new Date().toISOString(),
          device_name: deviceData.device_name,
        })
      );

      // Update stored devices list
      const storedDevices = JSON.parse(localStorage.getItem('user_devices') || '[]');
      storedDevices.push({
        device_id: deviceUUID,
        user_client_id: clientId,
        device_name: deviceData.device_name,
        device_type: deviceData.device_type,
        protocol_type: deviceData.protocol_type,
        device_status: deviceData.device_status,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('user_devices', JSON.stringify(storedDevices));

      // Create a mapping in user_client_devices table if it exists
      try {
        // Check if user_client_devices table exists (optional)
        const { error: tableError } = await supabase
          .from('user_client_devices')
          .select('*')
          .limit(1);

        // If the table exists, create the mapping
        if (!tableError) {
          console.log('Attempting to create mapping in user_client_devices table');

          const mappingData = {
            user_client_id: clientId,
            device_id: deviceUUID,
            created_at: new Date().toISOString(),
            is_primary: true,
          };

          const { error: mappingError } = await supabase
            .from('user_client_devices')
            .insert([mappingData]);

          if (mappingError) {
            console.error('Error creating mapping:', mappingError);
            console.error('Error details:', JSON.stringify(mappingError, null, 2));
          } else {
            console.log('Created mapping in user_client_devices table');
          }
        } else {
          console.log(
            "user_client_devices table doesn't exist, skipping mapping creation"
          );
        }
      } catch (error) {
        console.error('Error checking/creating mapping:', error);
      }

      toast.success('Device saved successfully!');

      // Call the onDeviceAdded callback if provided, otherwise reload the page
      if (onDeviceAdded) {
        onDeviceAdded();
        onClose();
      } else {
        // Wait a moment before closing and reloading
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Add New Device</h3>

      {isInitialized ? (
        <>
          <Button onClick={generateUUID} className="mb-4" disabled={loading}>
            Generate UUID
          </Button>
          {deviceUUID && <p className="mt-2 text-sm text-gray-700">UUID: {deviceUUID}</p>}
          <div className="mt-4 flex gap-2">
            <Button
              onClick={saveDevice}
              disabled={!deviceUUID || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save Device'}
            </Button>
            <Button onClick={onClose} className="bg-gray-300" disabled={loading}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Initializing...</span>
        </div>
      )}
    </div>
  );
}
