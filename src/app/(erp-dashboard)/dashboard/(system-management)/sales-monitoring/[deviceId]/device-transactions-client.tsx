"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SendTransaction from "@/app/components/SendTransaction";
import { supabase } from "@/lib/supabase";

interface Transaction {
  id: string;
  device_id: string;
  machine_id: string;
  amount: number;
  payment_method: string;
  transaction_date: string;
  status: string;
}

interface Device {
  id: string;
  machine_id: string;
  name: string;
  status?: string;
}

interface DeviceTransactionsClientProps {
  deviceId: string;
}

export function DeviceTransactionsClient({ deviceId }: DeviceTransactionsClientProps) {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSales, setTotalSales] = useState<number>(0);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load device details and transactions
  useEffect(() => {
    async function loadData() {
      if (!deviceId) return;
      
      try {
        // Fetch specific device
        const { data: deviceData, error: deviceError } = await supabase
          .from("device_list")
          .select("device_id, device_reg_id, device_name, device_status")
          .eq("device_id", deviceId)
          .single();
        
        if (deviceError) {
          console.error("Error fetching device:", deviceError);
          setError("Failed to fetch device details");
          setLoading(false);
          return;
        }
        
        if (!deviceData) {
          setError("Device not found");
          setLoading(false);
          return;
        }
        
        const deviceInfo = {
          id: deviceData.device_id,
          machine_id: deviceData.device_reg_id || "Unknown",
          name: deviceData.device_name || deviceData.device_reg_id || `Device ${deviceData.device_id}`,
          status: deviceData.device_status
        };
        
        // Store device info in localStorage for the SendTransaction component
        localStorage.setItem('device_info', JSON.stringify({
          device_id: deviceInfo.id,
          device_name: deviceInfo.name
        }));
        
        setDevice(deviceInfo);
        
        console.log("Using device ID:", deviceId);
        
        // Fetch transactions for this device
        const { data: transactionData, error: transactionError } = await supabase
          .from("transactions")
          .select("*")
          .eq("device_id", deviceId)
          .order("transaction_date", { ascending: false })
          .limit(20);
        
        if (transactionError) {
          console.error("Error fetching transactions:", transactionError);
        } else {
          setTransactions(transactionData || []);
          
          // Calculate total sales
          if (transactionData && transactionData.length > 0) {
            const total = transactionData.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
            setTotalSales(total);
          }
        }
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated && deviceId) {
      loadData();
    }
  }, [isAuthenticated, deviceId]);

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Format amount to currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleBackToList = () => {
    router.push('/dashboard/sales-monitoring');
  };

  // Create a test transaction
  const createTestTransaction = async () => {
    if (!device) return;

    const testAmount = 25.50;
    const testPaymentMethod = "coin_slot";

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          device_id: device.id,
          machine_id: device.machine_id,
          amount: testAmount,
          payment_method: testPaymentMethod,
          transaction_date: new Date().toISOString(),
          status: "completed"
        })
        .select();

      if (error) {
        console.error("Error creating test transaction:", error);
        return;
      }

      // Add the new entry to the state
      if (data && data.length > 0) {
        setTransactions(prev => [data[0], ...prev]);
        
        // Update total sales
        setTotalSales(prev => prev + testAmount);
      }
    } catch (err) {
      console.error("Failed to create test transaction:", err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={handleBackToList}>Back to Device List</Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button 
            variant="outline" 
            onClick={handleBackToList}
            className="mb-2"
          >
            ← Back to Device List
          </Button>
          <h1 className="text-2xl font-bold">
            {device?.name}
            {device?.status && (
              <Badge 
                className={`ml-2 ${
                  device.status === 'active' ? 'bg-green-500' : 
                  device.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                }`}
              >
                {device.status}
              </Badge>
            )}
          </h1>
          <p className="text-gray-500">Device ID: {device?.id}</p>
          <p className="text-gray-500">Machine ID: {device?.machine_id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-xl font-bold">{formatCurrency(totalSales)}</p>
        </div>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="send-transaction">Send Transaction</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <Button onClick={createTestTransaction} variant="outline" size="sm">
                  Create Test Transaction
                </Button>
              </div>
              <CardDescription>Recent transactions for this device</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDate(transaction.transaction_date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{formatCurrency(transaction.amount)}</td>
                          <td className="px-6 py-4 capitalize">{transaction.payment_method.replace('_', ' ')}</td>
                          <td className="px-6 py-4">
                            <Badge className={transaction.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                              {transaction.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">No transaction history available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Send Transaction Tab */}
        <TabsContent value="send-transaction">
          <Card>
            <CardHeader>
              <CardTitle>Send Transaction</CardTitle>
              <CardDescription>Send a transaction for this device</CardDescription>
            </CardHeader>
            <CardContent>
              <SendTransaction machineId={device?.machine_id || ""} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 