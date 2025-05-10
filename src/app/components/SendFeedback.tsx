"use client";
import { useState } from "react";
import { sendFeedback } from "@/lib/hardwareApi";

export default function SendFeedback({ machineId }: { machineId: string }) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState<string | null>(null);

  const handleSend = async () => {
    try {
      const res = await sendFeedback(machineId, rating);
      if (res.error) {
        setMessage(res.error);
      } else {
        setMessage("Feedback sent successfully");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to send feedback");
    }
  };

  return (
    <div>
      <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border p-2 mr-2">
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
        Send Feedback
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
} 