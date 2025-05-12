"use client";
import { useState } from "react";
import { sendTransaction } from "@/lib/hardwareApi";

export default function SendTransaction({ machineId }: { machineId: string }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage("Please enter a valid amount");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage(null);
    
    try {
      const res = await sendTransaction(machineId, Number(amount));
      
      setIsLoading(false);
      
      if (res.error) {
        setMessage(res.error);
        setIsSuccess(false);
      } else if (res.data) {
        setMessage(res.data.message || "Transaction sent successfully");
        setIsSuccess(true);
        setAmount(""); // Clear the amount field after successful transaction
      }
    } catch (error) {
      setIsLoading(false);
      setMessage(error instanceof Error ? error.message : "Failed to send transaction");
      setIsSuccess(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-medium mb-3">Send Transaction</h3>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="border rounded px-3 py-2 flex-grow"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            className={`px-4 py-2 rounded text-white ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        
        {message && (
          <div className={`mt-2 text-sm p-2 rounded ${isSuccess 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
} 