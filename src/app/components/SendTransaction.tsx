"use client";
import { useState } from "react";
import { sendTransaction } from "@/lib/hardwareApi";

export default function SendTransaction({ machineId }: { machineId: string }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSend = async () => {
    try {
      const res = await sendTransaction(machineId, Number(amount));
      if (res.error) {
        setMessage(res.error);
      } else {
        setMessage("Transaction sent successfully");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to send transaction");
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
        Send Transaction
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
} 